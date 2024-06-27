<template>
  <el-descriptions border :column="1">
    <el-descriptions-item label="Connection name">{{ datasource.name }}</el-descriptions-item>
    <el-descriptions-item label="Connection type">{{ datasource.type }}</el-descriptions-item>
    <el-descriptions-item label="Database type">{{ datasource.config?.dbKind }}</el-descriptions-item>
    <el-descriptions-item label="URL">{{ datasource.config?.url }}</el-descriptions-item>
    <el-descriptions-item v-if="datasource.config?.username" label="Username">{{ datasource.config?.username }}</el-descriptions-item>
    <el-descriptions-item v-if="datasource.config?.password" label="Password">
      <HidePassword :text="datasource.config?.password"/>
    </el-descriptions-item>
    <el-descriptions-item label="Create time">{{ datasource.createdAt }}</el-descriptions-item>
  </el-descriptions>
</template>
<script setup lang="ts">
import HidePassword from "~/components/HidePassword.vue";

const props = defineProps(['datasource']);

</script>
<style scoped>

</style>
