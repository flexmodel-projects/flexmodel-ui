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

const props = defineProps(['visible', 'datasource', 'model', 'field', 'currentValue']);
const emits = defineEmits(['change']);

const visible = ref<boolean>(props.visible);
const form = ref<any>();
const formRef = ref<FormInstance>();

const submitForm = (formEl: FormInstance | undefined) => {
  visible.value = false;
  emits('change', form.value);
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
    visible.value = props.currentValue;
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
