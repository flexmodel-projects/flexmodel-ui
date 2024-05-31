<template>
  <BaseHeader/>
  <div class="flex main-container">
    <BaseSide/>
    <div class="container-box">
      <router-view v-slot="{ Component }">
        <component :is="Component"/>
      </router-view>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style>
#app {
  color: var(--ep-text-color-primary);
}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 3px);

  .container-box {
    padding: 0 15px 15px;
    width: 100%;
    background-color: var(--ep-fill-color);
  }

  .content {
    border-radius: 5px;
    box-shadow: 5px 5px 10px 0 rgb(102 102 102 / 10%);
    margin-top: 15px;
    padding: 15px;
    background-color: var(--ep-bg-color);
  }
}
</style>
