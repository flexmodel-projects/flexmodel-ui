<template>
  <div>
    {{ isHide ? '***********' : text }}
    <el-button :icon="isHide? Hide : View" v-model="isHide" @click="isHide=!isHide" link/>
  </div>
</template>
<script setup lang="ts">
import {ref, watchEffect} from "vue";
import {Hide, View,} from "@element-plus/icons-vue";

const props = defineProps(['text']);
const isHide = ref<boolean>(true);
const text = ref<string>();
watchEffect(() => {
  text.value = props.text;
  isHide.value = true;
});
</script>
<style scoped>

</style>
