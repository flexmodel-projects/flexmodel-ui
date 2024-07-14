<template>
  <el-dialog v-model="visible" width="500px">
    <template #header>
      {{ form.type }}
    </template>
    <el-form ref="formRef" label-width="130px" :model="form">
      <el-form-item v-if="form.type==='FixedValueGenerator'"
                    label="Fixed value" prop="value" required>
        <FieldValue
          v-model="form.value"
          :datasource="datasource"
          :model="model"
          :field="field"
        />
      </el-form-item>
      <el-form-item label="Generation time" prop="generationTime">
        <el-select v-model="form.generationTime">
          <el-option v-for="item in GenerationTimes"
                     :key="item.name"
                     :label="item.label"
                     :value="item.name"/>
        </el-select>
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
import {ref, watchEffect} from "vue";
import type {FormInstance} from "element-plus";
import {GenerationTimes} from "~/types";
import FieldValue from "~/views/modeling/FieldValue.vue";

const props = defineProps(['datasource', 'model', 'field', 'currentValue']);
const emits = defineEmits(['change']);

const visible = defineModel<boolean>('visible');

const form = ref<any>();
const formRef = ref<FormInstance>();

const submitForm = (formEl: FormInstance | undefined) => {
  emits('change', form.value);
}
const cancelForm = (formEl: FormInstance | undefined) => {
  visible.value = false;
}

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
