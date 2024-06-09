<template>
  <el-dialog v-model="visible">
    <template #header>
      New index
    </template>
    322323
    <template #footer>
      <div class="text-center">
        <el-button @click="visible = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm">
          Conform
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import {ref, watchEffect} from "vue";

const props = defineProps(['modelValue', 'datasource', 'model']);
const emits = defineEmits(['update:modelValue']);
const visible = ref<boolean>(props.modelValue);
watchEffect(() => {
  if (props.modelValue) {
    visible.value = props.modelValue;
  }
});
watchEffect(() => {
  if (visible) {
    emits('update:modelValue', visible);
  }
});

</script>
<style scoped>

</style>
