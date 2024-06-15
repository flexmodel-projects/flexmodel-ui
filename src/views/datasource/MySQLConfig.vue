<template>
  <el-form label-position="top"
           :model="config">
    <el-form-item required label="Database URL" prop="url">
      <InputVariables placeholder="jdbc:mysql://localhost:3306/db_name" v-model="config.url"/>
    </el-form-item>
    <el-form-item label="Username" prop="username">
      <InputVariables v-model="config.username"/>
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <InputVariables v-model="config.password"/>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import {ref, watchEffect} from "vue";
import InputVariables from "~/components/InputVariables.vue";

const props = defineProps(['modelValue']);
const emits = defineEmits(['update:modelValue']);

const config = ref<any>({
  dbKind: 'mysql',
  url: '',
  username: '',
  password: '',
});

watchEffect(() => {
  if (props.modelValue) {
    config.value.dbKind = props.modelValue.dbKind;
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
