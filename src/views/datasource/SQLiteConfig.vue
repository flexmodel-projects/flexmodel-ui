<template>
  <el-form label-position="top"
           :model="config">
    <el-form-item required label="Database URL" prop="url">
      <el-input placeholder="sqlite" type="file" v-model="config.file"/>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import {reactive, watchEffect} from "vue";

const props = defineProps(['modelValue']);
const emits = defineEmits(['update:modelValue']);
const config = reactive<any>({
  dbKind: 'sqlite',
  file: ''
});
watchEffect(() => {
  if (props.modelValue) {
    config.dbKind = props.modelValue.dbKind;
  }
})
watchEffect(() => {
  if (config) {
    emits('update:modelValue', config);
  }
});
</script>
<style scoped>

</style>
