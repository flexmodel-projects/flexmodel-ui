<template>
  <el-form label-position="top"
           :model="config">
    <el-form-item required label="Database URL" prop="url">
      <el-input placeholder="sqlite" type="file" v-model="config.file"/>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">

const config = defineModel<any>({required: true});

</script>
<style scoped>

</style>
