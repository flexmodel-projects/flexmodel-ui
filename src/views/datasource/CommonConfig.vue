<template>
  <el-form label-position="top"
           :model="config">
    <el-form-item required label="Database URL" prop="url">
      <InputVariables placeholder="e.g. jdbc:mysql://xxxx" v-model="config.url"/>
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
import InputVariables from "~/components/InputVariables.vue";

const config = defineModel({required: true});
</script>
<style scoped>

</style>
