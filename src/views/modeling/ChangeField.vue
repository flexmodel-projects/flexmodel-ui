<template>
  <el-dialog v-model="visible">
    <template #header>
      New field
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

const visible = ref<boolean>(false);
const datasourceName = ref<string>("");
const model = ref<any>({});
const props = defineProps(['modelValue', 'datasource', 'model']);
const emits = defineEmits(['update:modelValue']);

watchEffect(() => {
  if (props.modelValue) {
    visible.value = props.modelValue;
    datasourceName.value = props.datasource;
    model.value = props.model;
  }
})
watchEffect(() => {
  if (visible) {
    emits('update:modelValue', visible);
  }
})

</script>
<style scoped>

</style>
