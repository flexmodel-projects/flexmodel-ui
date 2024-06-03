<template>
  <el-form label-position="top"
           :modelValue="config">
    <el-form-item label="Database URL" prop="url">
      <el-input placeholder="e.g. jdbc:mysql://xxxx" v-model="config.url"/>
    </el-form-item>
    <el-form-item required label="Username" prop="username">
      <el-input v-model="config.username"/>
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input v-model="config.password"/>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import {reactive, watchEffect} from "vue";

const props = defineProps(['modelValue']);
const emits = defineEmits(['update:modelValue']);
const config = reactive<any>({
  dbKind: '',
  url: '',
  username: '',
  password: '',
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
