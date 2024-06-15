<template>
  <el-dialog v-model="visible" width="500px">
    <template #header>
      {{ form.type }}
    </template>
    <el-form ref="formRef" label-width="130px" :model="form">
      <div v-if="field.type==='string'">
        <el-form-item v-if="form.type==='RegexpValidator'" label="Regexp" prop="regexp" required>
          <el-input v-model="form.regexp"/>
        </el-form-item>
      </div>
      <div v-if="field.type==='text'"></div>
      <div v-if="field.type==='int'">
        <el-form-item
          v-if="form.type==='NumberMinValidator' || form.type==='NumberRangeValidator'"
          label="Min" prop="min" required>
          <FieldValue
            v-model="form.min"
            :datasource="datasource"
            :model="model"
            :field="field"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type==='NumberMaxValidator' || form.type==='NumberRangeValidator'"
          label="Max" prop="max" required>
          <FieldValue
            v-model="form.max"
            :datasource="datasource"
            :model="model"
            :field="field"
          />
        </el-form-item>
      </div>
      <div v-if="field.type==='bigint'"></div>
      <div v-if="field.type==='decimal'"></div>
      <div v-if="field.type==='boolean'"></div>
      <div v-if="field.type==='datetime'">
        <el-form-item
          v-if="form.type==='DatetimeMinValidator' || form.type==='DatetimeRangeValidator'"
          label="Min" prop="min" required>
          <FieldValue
            v-model="form.min"
            :datasource="datasource"
            :model="model"
            :field="field"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type==='DatetimeMaxValidator' || form.type==='DatetimeRangeValidator'"
          label="Max" prop="max" required>
          <FieldValue
            v-model="form.max"
            :datasource="datasource"
            :model="model"
            :field="field"
          />
        </el-form-item>
      </div>
      <div v-if="field.type==='date'">
        <el-form-item
          v-if="form.type==='DateMinValidator' || form.type==='DateRangeValidator'"
          label="Min" prop="min" required>
          <FieldValue
            v-model="form.min"
            :datasource="datasource"
            :model="model"
            :field="field"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type==='DateMaxValidator' || form.type==='DateRangeValidator'"
          label="Max" prop="max" required>
          <FieldValue
            v-model="form.max"
            :datasource="datasource"
            :model="model"
            :field="field"
          />
        </el-form-item>
      </div>
      <div v-if="field.type==='json'"></div>
      <el-form-item label="Message" prop="message">
        <el-input v-model="form.message"/>
      </el-form-item>
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
import FieldValue from "~/views/modeling/FieldValue.vue";
import {ref, watchEffect} from "vue";
import type {FormInstance} from "element-plus";

const props = defineProps(['visible', 'currentValue', 'datasource', 'model', 'field']);
const emits = defineEmits(['change']);
const visible = ref<boolean>(props.visible);
const form = ref<any>({});
const formRef = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  visible.value = false;
  emits('change', {...form.value});
  if (!formEl) return;
  formEl.resetFields();
}
const cancelForm = (formEl: FormInstance | undefined) => {
  visible.value = false;
  if (!formEl) return;
  formEl.resetFields();
}
watchEffect(() => {
  if (props.visible) {
    visible.value = props.visible;
  }
});
watchEffect(() => {
  if (props.currentValue) {
    form.value = props.currentValue;
  }
});
</script>

<style scoped>
.ep-form-item {
  display: flex;
  --font-size: 14px;
  margin-bottom: 18px;
}
</style>
