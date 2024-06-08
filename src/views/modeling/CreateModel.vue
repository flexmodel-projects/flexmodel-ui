<template>
  <el-drawer v-model="drawer" title="Create model" size="50%">
    22222
  </el-drawer>
</template>
<script setup lang="ts">
import {ref, watchEffect} from "vue";

const props = defineProps(['datasource', 'drawer']);
const drawer = ref(false);
watchEffect(() => {
  if (props.drawer) {
    drawer.value = props.drawer;
  }
});
</script>

<style scoped>

</style>
