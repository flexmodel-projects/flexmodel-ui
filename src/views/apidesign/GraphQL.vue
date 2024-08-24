<template>
  <div>
    <el-form label-position="right"  label-width="150px">
      <el-form-item label="Name" prop="name" required>
        <el-input />
      </el-form-item>
      <el-form-item label="URI" prop="path" required>
        <el-input >
          <template #append>
            <el-select  style="width: 100px" disabled>
              <el-option value="GET"/>
              <el-option value="POST"/>
              <el-option value="PUT"/>
              <el-option value="DELETE"/>
            </el-select>
          </template>
          <template #prefix>
            <div>
              {{ BASE_URI }}/v1
            </div>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="Auth" prop="auth">
        <el-switch />
      </el-form-item>
      <el-form-item required label="Identifier Provider"
                    prop="identityProvider">
        <el-select>
<!--          <el-option
            v-for="item in idPs"
            :key="item.name"
            :value="item.name"
            :label="item.name"
          />-->
        </el-select>
      </el-form-item>
    </el-form>
  </div>
  <div style="height: 100%">
    <iframe style="width: 100%;height: 100%;border: unset;" src="/graphiql/index.html"></iframe>
  </div>
</template>
<script setup lang="ts">

import {BASE_URI} from "~/api/base";
</script>
<style scoped>
.center {
  position: absolute;
  top: 50%;
  left: 60%;
  transform: translate(-50%, -50%);
}
</style>
