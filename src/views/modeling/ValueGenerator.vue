<template>
  <el-dialog v-model="visible" width="500px">
    <template #header>
      {{ form }}
    </template>
    <el-form ref="formRef" label-width="130px" :model="form">
      <el-form-item label="Skip if non null" prop="skipIfNonNull">
        <el-switch v-model="form.skipIfNonNull"/>
      </el-form-item>
      <div v-if="field.type==='string'"></div>
      <div v-if="field.type==='text'"></div>
      <div v-if="field.type==='int'"></div>
      <div v-if="field.type==='bigint'"></div>
      <div v-if="field.type==='decimal'"></div>
      <div v-if="field.type==='boolean'"></div>
      <div v-if="field.type==='datetime'"></div>
      <div v-if="field.type==='date'"></div>
      <div v-if="field.type==='json'"></div>
    </el-form>
    <template #footer>
      <div class="text-center">
        <el-button @click="visible = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm(formRef)">
          Conform
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import {reactive, ref, watchEffect} from "vue";
import type {FormInstance} from "element-plus";

const props = defineProps(['visible', 'modelValue', 'datasource', 'model', 'field']);
const emits = defineEmits(['update:modelValue', 'add']);
const visible = ref<boolean>(props.visible);
watchEffect(() => {
  if (props.visible) {
    visible.value = props.visible;
  }
});
const form = reactive<any>(props.modelValue);
const formRef = ref<FormInstance>({});
const submitForm = (formEl: FormInstance | undefined) => {
  visible.value = false;
  emits('update:modelValue', form);
  emits('add', {...form});
  if (!formEl) return;
  formEl.resetFields();
}
</script>

<style scoped>
.ep-form-item {
  display: flex;
  --font-size: 14px;
  margin-bottom: 18px;
}
</style>
