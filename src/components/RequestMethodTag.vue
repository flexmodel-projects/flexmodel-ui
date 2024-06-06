<template>
  <div class="tree-item-icon">
    <span v-if="method=='GET'" style="color: green;">&nbsp;&nbsp;GET</span>
    <span v-else-if="method=='POST'" style="color: goldenrod;">POST</span>
    <span v-else-if="method=='PUT'" style="color: mediumblue;">&nbsp;&nbsp;PUT</span>
    <span v-else-if="method=='DELETE'" style="color: red;">&nbsp;&nbsp;DEL</span>
    <span v-else>{{ method }}</span>
  </div>
</template>
<script setup lang="ts">
const props = defineProps(['method']);
</script>

<style scoped>
.tree-item-icon {
  text-align: right;
  font-weight: bold;
}
</style>
