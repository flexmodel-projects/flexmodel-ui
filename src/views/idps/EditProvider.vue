<template>
  <el-dialog v-model="visible" width="500px">
    <template #header>
      Edit provider
    </template>
    <el-form :model="form" label-position="top">
      <el-form-item label="Connection name" prop="name">
        <el-input :model-value="form.name" readonly disabled/>
      </el-form-item>
      <OIdcProvider v-model="form.provider"/>
    </el-form>
    <template #footer>
      <el-button @click="cancelForm">Cancel</el-button>
      <el-button type="primary" @click="submitForm">Conform</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import OIdcProvider from "~/views/idps/OIdcProvider.vue";

const emits = defineEmits(['conform', 'cancel']);

const form = defineModel<any>({required: true});
const visible = defineModel<boolean>('visible');

const cancelForm = () => {
  emits('cancel');
}
const submitForm = () => {
  emits('conform', form);
}
</script>
<style scoped>

</style>
