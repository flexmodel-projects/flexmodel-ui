<template>
  <el-form label-position="top"
           :model="provider">
    <el-form-item required label="Issuer" prop="issuer">
      <InputVariables placeholder="e.g. http://localhost:8080/realms/master" v-model="provider.issuer"/>
    </el-form-item>
    <el-form-item v-if="provider.issuer" label="Discovery endpoint">
      {{provider.issuer}}/.well-known/openid-configuration
    </el-form-item>

    <el-form-item required label="Client ID" prop="clientId">
      <InputVariables v-model="provider.clientId"/>
    </el-form-item>
    <el-form-item required label="Client Secret" prop="clientSecret">
      <InputVariables v-model="provider.clientSecret"/>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import InputVariables from "~/components/InputVariables.vue";

const provider = defineModel<any>({required: true});
</script>
<style scoped>

</style>
