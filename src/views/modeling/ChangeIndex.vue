<template>
  <el-dialog v-model="visible" width="580px">
    <template #header>
      <span v-if="form.name">Edit index</span>
      <span v-else>New index</span>
    </template>
    <el-form :model="form" ref="formRef">
      <el-form-item label="Name" prop="name" required>
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="Fields" prop="fields" required>
        <el-select v-model="form.fields" multiple filterable>
          <el-option-group>
            <el-option
              v-for="item in model.fields"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-option-group>
          <el-option-group label="DESC">
            <el-option
              v-for="item in model.fields"
              :key="`${item.name}:DESC`"
              :label="`${item.name} DESC`"
              :value="`${item.name}:DESC`"
            />
          </el-option-group>
          <el-option-group label="ASC">
            <el-option
              v-for="item in model.fields"
              :key="`${item.name}:ASC`"
              :label="`${item.name} ASC`"
              :value="`${item.name}:ASC`"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="Unique" prop="unique">
        <el-switch v-model="form.unique"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="text-center">
        <el-button @click="cancelForm">Cancel</el-button>
        <el-button type="primary" @click="submitForm">
          Conform
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import {reactive, ref, watchEffect} from "vue";
import type {FormInstance} from "element-plus";

const props = defineProps(['datasource', 'model', 'currentValue']);
const emits = defineEmits(['conform', 'cancel']);

const visible = defineModel('visible');

const form = reactive<any>({});
const formRef = ref<FormInstance>();

const submitForm = () => {
  emits('conform', {
    name: form.name,
    fields: form.fields.map((f: any) => {
      let fieldName = f;
      let direction = undefined;
      if (f.endsWith('ASC')) {
        fieldName = f.replace(':ASC', '');
        direction = 'ASC';
      } else if (f.endsWith('DESC')) {
        fieldName = f.replace(':DESC', '');
        direction = 'DESC';
      }
      return {
        fieldName: fieldName,
        direction: direction,
      }
    }),
    unique: form.unique
  });
}
const cancelForm = () => {
  emits('cancel');
}

watchEffect(() => {
  if (props.currentValue) {
    Object.assign(form, {
      name: props.currentValue?.name || '',
      fields: props.currentValue.fields?.map((f: any) => {
        if (f.direction) {
          return `${f.fieldName}:${f.direction}`;
        }
        return f.fieldName;
      }) || [],
      unique: props?.currentValue?.unique || false,
    });
  }
})
</script>
<style scoped>

</style>
