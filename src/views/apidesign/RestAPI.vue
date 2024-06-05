<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span>Add Rest API</span>
      </div>
    </template>
    <el-row>
      <el-col :span="6">
        <el-card shadow="never">
          <SelectModel datasource="system" @change="item=>console.log('2222',item)"/>
        </el-card>
      </el-col>
      <el-col :span="18">
      </el-col>
    </el-row>

    <template #footer>
      <div class="text-center">
        <el-button @click="resetForm(formRef)">Cancel</el-button>
        <el-button type="primary" @click="submitForm(formRef)">
          Create
        </el-button>
      </div>
    </template>
  </el-card>
</template>
<script setup lang="ts">

import SelectModel from "~/components/SelectModel.vue";
</script>
<style scoped>

</style>
