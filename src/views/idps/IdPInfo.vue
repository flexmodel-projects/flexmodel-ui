<template>
  <el-descriptions border :column="1">
    <el-descriptions-item label="Display name">{{ data.name }}</el-descriptions-item>
    <el-descriptions-item label="Provider type">{{ data.provider?.type }}</el-descriptions-item>
    <el-descriptions-item label="Issuer">{{ data.provider?.issuer }}</el-descriptions-item>
    <el-descriptions-item v-if="data.provider?.issuer" label="Discovery endpoint">{{ data.provider?.issuer }}/.well-known/openid-configuration
    </el-descriptions-item>
    <el-descriptions-item label="Client ID">{{ data.provider?.clientId }}</el-descriptions-item>
    <el-descriptions-item label="Client Secret">
      <HidePassword :text="data.provider?.clientSecret"/>
    </el-descriptions-item>
  </el-descriptions>
</template>
<script setup lang="ts">
import HidePassword from "~/components/HidePassword.vue";

const data = defineModel<any>({required: true});

</script>
<style scoped>

</style>
