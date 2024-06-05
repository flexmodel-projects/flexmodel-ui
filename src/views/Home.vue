<template>
  <BaseHeader/>
  <div class="flex main-container">
    <BaseSide/>
    <div class="container-box">
      <div class="content">
      <router-view v-slot="{ Component }">
        <component :is="Component"/>
      </router-view>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style>
#app {
  color: var(--ep-text-color-primary);
}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 5px);

  .container-box {
    padding: 10px;
    width: 100%;
    background-color: var(--ep-fill-color);
  }

  .content {
    width: auto;
    height: 100%;
    padding: 15px;
    overflow-y: auto;
    box-sizing: border-box;
    border-radius: 5px;
    box-shadow: 5px 5px 10px 0 rgb(102 102 102 / 10%);
    background-color: var(--ep-bg-color);
  }
  .ep-card {
    border-radius: unset;
  }
}

</style>
