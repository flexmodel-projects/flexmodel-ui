<template>
  <el-dialog @close="cancelForm(formRef)" v-model="visible">
    <template #header>
      <span v-if="props.currentValue.name">Edit field</span>
      <span v-else>New field</span>
    </template>
    <el-form label-position="right"
             label-width="150px" :model="form" ref="formRef">
      <el-form-item label="Name" prop="name" required>
        <el-input v-model="form.name" :disabled="props.currentValue.name != null"/>
      </el-form-item>
      <el-form-item label="Comment" prop="comment">
        <el-input v-model="form.comment"/>
      </el-form-item>
      <el-form-item label="Type" prop="type" required>
        <el-select v-model="tmpType" style="width: 100%;" filterable>
          <el-option-group label="ID">
            <el-option key="id" label="ID" value="id" :disabled="hasId"/>
          </el-option-group>
          <el-option-group label="Basic field">
            <el-option v-for="item in BasicFieldTypes"
                       :key="item.name"
                       :label="item.label"
                       :value="item.name"/>
          </el-option-group>
          <el-option-group label="Relation">
            <el-option v-for="item in modelList"
                       :key="item.name"
                       :label="item.name"
                       :value="`relation:${item.name}`"/>
          </el-option-group>
        </el-select>
      </el-form-item>
      <!-- field extend item start-->
      <div v-if="form.type==='id'">
        <el-form-item label="Generated value" prop="comment">
          <el-select v-model="form.generatedValue" style="width: 100%;">
            <el-option v-for="item in IDGeneratedValues"
                       :key="item.name"
                       :label="item.label"
                       :value="item.name"/>
          </el-select>
        </el-form-item>
      </div>
      <div v-if="form.type==='string'">
        <el-form-item label="Length" prop="length">
          <el-input type="number" v-model="form.length"/>
        </el-form-item>

      </div>
      <div v-if="form.type==='text'">
      </div>
      <div v-if="form.type==='int'">
      </div>
      <div v-if="form.type==='bigint'">
      </div>
      <div v-if="form.type==='decimal'">
        <el-form-item label="Precision" prop="precision">
          <el-input type="number" v-model="form.precision"/>
        </el-form-item>
        <el-form-item label="Scale" prop="scale">
          <el-input type="number" v-model="form.scale"/>
        </el-form-item>
      </div>
      <div v-if="form.type==='boolean'">
      </div>
      <div v-if="form.type==='datetime'">
      </div>
      <div v-if="form.type==='date'">
      </div>
      <div v-if="form.type==='json'">
      </div>
      <div v-if="form.type==='relation'">
        <el-form-item label="Target field" prop="targetField" required>
          <el-select v-model="form.targetField">
            <el-option v-for="item in relationModel?.fields"
                       :key="item.name"
                       :label="item.name"
                       :value="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Cardinality" prop="cardinality">
          <el-radio-group class="ml-4" v-model="form.cardinality">
            <el-radio value="ONE_TO_ONE">One to one</el-radio>
            <el-radio value="ONE_TO_MANY">One to many</el-radio>
            <el-radio value="MANY_TO_MANY">Many to many</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Cascade delete" prop="cascadeDelete">
          <el-switch v-model="form.cascadeDelete"/>
        </el-form-item>
      </div>
      <!-- field extend item end-->
      <el-form-item v-if="GeneratorTypes[form.type]?.length > 0" label="Default value">
        <ValueGeneratorList
          v-model="form.generator"
          :datasource="datasource"
          :model="model"
          :field="form"
        />
      </el-form-item>
      <el-form-item v-if="ValidatorTypes[form.type]?.length > 0" label="Value validators">
        <ConstraintValidatorList
          v-model="form.validators"
          :datasource="datasource"
          :model="model"
          :field="form"
        />
      </el-form-item>
      <div v-if="!(form.type==='id' || form.type?.startsWith('relation'))">
        <el-form-item label="Nullable" prop="nullable">
          <el-switch v-model="form.nullable"/>
        </el-form-item>
        <el-form-item label="Unique" prop="unique">
          <el-switch v-model="form.unique"/>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="text-center">
        <el-button @click="cancelForm(formRef)">Cancel</el-button>
        <el-button type="primary" @click="submitForm(formRef)">
          Conform
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import {computed, reactive, ref, watch, watchEffect} from "vue";
import {BasicFieldTypes, FieldInitialValues, GeneratorTypes, IDGeneratedValues, ValidatorTypes} from "~/types";
import {getModelList} from "~/api/model";
import ConstraintValidatorList from "~/views/modeling/ConstraintValidatorList.vue";
import type {FormInstance} from "element-plus";
import ValueGeneratorList from "~/views/modeling/ValueGeneratorList.vue";

const props = defineProps(['datasource', 'model', 'currentValue']);
const emits = defineEmits(['conform', 'cancel']);

const visible = defineModel('visible');

const modelList = ref<any[]>([]);
const formRef = ref<FormInstance>();
const form = reactive<any>({
  type: '',
  tmpType: '',
  name: '',
  comment: '',
  unique: false,
  nullable: true,
});
const tmpType = computed({
    get: () => form.type === 'relation' ?
      `${form.type}:${form.targetEntity}` : form.type,
    set: (val) => {
      if (val.startsWith('relation')) {
        form.type = 'relation';
        form.targetEntity = val.replace('relation:', '');
        form.targetField = '';
      } else {
        form.type = val;
      }
    }
  })
;
const relationModel = computed<any>(() => modelList.value.filter(m => tmpType.value?.endsWith(m.name))[0]);
// 只能有一个ID字段
const hasId = computed<boolean>(() => props.model.fields?.filter((f: any) => f.type === 'id').length > 0);

const reqModelList = async () => {
  modelList.value = await getModelList(props.datasource);
};
const cancelForm = (formEl: FormInstance | undefined) => {
  emits('cancel');
}
const submitForm = (formEl: FormInstance | undefined) => {
  emits('conform', form);
}

watch(() => tmpType?.value, () => {
  Object.assign(form, {
    ...FieldInitialValues[form.type],
    ...form,
  });
});
watchEffect(() => {
  if (visible.value) {
    reqModelList();
  }
});
watchEffect(() => {
  if (props.currentValue) {
    Object.assign(form, props.currentValue);
  }
});
</script>
<style scoped>

</style>
