<script lang="ts" setup>
import {toggleDark} from "~/composables";
</script>
<style>
.flex-grow {
  flex-grow: 1;
}
</style>
<template>
  <el-menu mode="horizontal" :ellipsis="false">
    <el-row>
      <el-col :span="12">
        <img
          style="width: 38px;padding: 12px;"
          src="/logo.svg"
          alt="Flexmodel logo"
        />
      </el-col>
      <el-col :span="12">
        <div style="padding-top: 20px; font-size: 18px;">
          Flexmodel
        </div>
      </el-col>
    </el-row>
    <div class="flex-grow"/>
    <el-menu-item h="full" @click="toggleDark()" index="1">
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(&#45;&#45;ep-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny"/>
      </button>
    </el-menu-item>
  </el-menu>
</template>
