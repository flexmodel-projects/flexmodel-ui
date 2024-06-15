<template>
  <el-tabs tab-position="left" style="height: 100%">
<!--    <el-tab-pane label="Application">Application</el-tab-pane>-->
    <el-tab-pane label="Variables">
      <Variables/>
    </el-tab-pane>
    <el-tab-pane label="Security">Security</el-tab-pane>
    <el-tab-pane label="About">
      <About/>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import Variables from "~/views/settings/Variables.vue";
import About from "~/views/settings/About.vue";
</script>
<style scoped>

</style>
