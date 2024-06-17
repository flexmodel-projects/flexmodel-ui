<template>
  <el-dialog v-model="visible" width="500px">
    <template #header>
      Edit Database
    </template>
    <el-form :model="form" label-width="150px">
      <el-form-item label="Connection name" prop="name">
        <el-input :model-value="datasource.name" readonly disabled/>
      </el-form-item>
      <el-form-item required label="Database URL" prop="url">
        <InputVariables v-model="form.url"/>
      </el-form-item>
      <el-form-item label="Username" prop="username">
        <InputVariables v-model="form.username"/>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <InputVariables type="password" v-model="form.password"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelForm">Cancel</el-button>
      <el-button type="primary" @click="submitForm">Conform</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import {ref, watchEffect} from "vue";
import InputVariables from "~/components/InputVariables.vue";

const props = defineProps(['visible', 'datasource', 'modelValue']);
const emits = defineEmits(['conform', 'cancel']);

const visible = ref<boolean>(false);
const form = defineModel<any>({required: true});

const cancelForm = () => {
  emits('cancel');
  visible.value = false;
}
const submitForm = () => {
  emits('conform', form.value);
  visible.value = false;
}
watchEffect(() => {
  if (props.visible) {
    visible.value = props.visible;
  }
});
</script>
<style scoped>

</style>
