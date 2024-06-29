<template>
  <el-input ref="inputRef" v-model="val" @keyup.enter="handleKeyEnter" size="small"/>
</template>
<script setup lang="ts">
import {ref, watchEffect} from "vue";
import {InputInstance} from "element-plus";

const emits = defineEmits(['change']);

const val = defineModel<string>({required: true});

const inputRef = ref<InputInstance>()

const handleKeyEnter = () => {
  emits('change', inputRef.value);
}

watchEffect(() => {
  if (val.value) {
    inputRef.value?.focus();
    inputRef.value?.select();
  }
})
</script>
