<template>
  <el-input
    v-for="(item, index) in list"
    :key="index"
    class="mb-12px"
    readonly
    :model-value="displayValue(item)"
  >
    <template #suffix>
      <el-icon class="mr-6px cursor-pointer hover:text-[el-color-primary]" @click="delItem(index)">
        <Close/>
      </el-icon>
      <el-icon class="cursor-pointer hover:text-[el-color-primary]" @click="editItem(index)">
        <Edit/>
      </el-icon>
    </template>
  </el-input>
  <el-dropdown trigger="click" @command="handleCommand">
    <el-button :icon="Plus">
      <el-icon class="hover:text-[el-color-primary]">
        <ArrowDown/>
      </el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(item, index) in filteredValidatorTypes"
          :key="index"
          :command="item.name"
          @click="addItem"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <ConstraintValidator :current-value="form"
                       @close="dialogVisible = false"
                       @change="handleChange"
                       v-model:visible="dialogVisible"
                       :field="field"/>
</template>
<script setup lang="ts">
import {computed, reactive, ref, watchEffect} from "vue";
import {ValidatorTypes} from "~/types";
import {ArrowDown, Close, Edit, Plus} from "@element-plus/icons-vue";
import ConstraintValidator from "~/views/modeling/ConstraintValidator.vue";

const props = defineProps(['datasource', 'model', 'field']);

const dialogVisible = ref<boolean>(false);
const form = reactive<any>({});
const selectedIndex = ref<number>(-1);
const list = defineModel<any[]>({default: []});

const filteredValidatorTypes = computed(() => ValidatorTypes[props.field?.type]);

const handleCommand = (command: string) => {
  form.type = command;
  dialogVisible.value = true;
}
const displayValue = (item: any) => {
  return `${item.type}: ${JSON.stringify(item)}`;
}
const addItem = () => {
  selectedIndex.value = -1;
  Object.assign(form, {})
  dialogVisible.value = true;
}
const delItem = (index: number) => {
  list.value.splice(index, 1);
}
const editItem = (index: number) => {
  dialogVisible.value = true;
  selectedIndex.value = index;
  Object.assign(form, list.value[index]);
}
const handleChange = (item: any) => {
  dialogVisible.value = false;
  if (selectedIndex.value == -1) {
    list.value.push({...item});
  } else {
    list.value[selectedIndex.value] = {...item};
  }
}

watchEffect(() => {
  if (props?.field.type) {
    Object.assign(list.value, []);
  }
});
</script>
<style scoped>

</style>
