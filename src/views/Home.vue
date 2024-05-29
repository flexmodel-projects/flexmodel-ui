<template>
  <BaseHeader/>
  <div class="flex main-container">
    <BaseSide/>
    <router-view v-slot="{ Component }">
      <component :is="Component"/>
    </router-view>
  </div>
</template>
<script setup lang="ts"></script>
<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 3px);
}
</style>
