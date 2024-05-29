<script lang="ts" setup>
import {toggleDark} from "~/composables";
</script>

<template>
  <el-menu mode="horizontal">
    <el-menu-item h="full">
      Flexmodel
    </el-menu-item>
    <el-menu-item h="full" @click="toggleDark()">
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(&#45;&#45;ep-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny"/>
      </button>
    </el-menu-item>
  </el-menu>
</template>
