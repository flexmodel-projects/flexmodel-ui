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
  <ConstraintValidator :current-value="validatorForm"
                       @close="validatorDialogVisible = false"
                       @change="handleChange"
                       :visible="validatorDialogVisible"
                       :field="field"/>
</template>
<script setup lang="ts">
import {computed, ref, watchEffect} from "vue";
import {ValidatorTypes} from "~/types";
import {ArrowDown, Close, Edit, Plus} from "@element-plus/icons-vue";
import ConstraintValidator from "~/views/modeling/ConstraintValidator.vue";

const props = defineProps(['modelValue', 'datasource', 'model', 'field']);
const emits = defineEmits(['update:modelValue']);

const validatorDialogVisible = ref<boolean>(false);
const validatorForm = ref<any>({});
const selectedIndex = ref<number>(-1);
const list = ref<any[]>([]);

const filteredValidatorTypes = computed(() => ValidatorTypes[props.field?.type]);

const handleCommand = (command: string) => {
  validatorForm.value.type = command;
  validatorDialogVisible.value = true;
}
const displayValue = (item: any) => {
  return `${item.type}: ${JSON.stringify(item)}`;
}
const addItem = () => {
  selectedIndex.value = -1;
  validatorForm.value = {};
  validatorDialogVisible.value = true;
}
const delItem = (index: number) => {
  list.value.splice(index, 1);
}
const editItem = (index: number) => {
  validatorDialogVisible.value = true;
  selectedIndex.value = index;
  validatorForm.value = list.value[index];
}
const handleChange = (item: any) => {
  if (selectedIndex.value == -1) {
    list.value.push(item);
  } else {
    list.value[selectedIndex.value] = item;
  }
}

watchEffect(() => {
  if (props?.field.type) {
    list.value = [];
  }
});
watchEffect(() => {
  if (list.value) {
    emits('update:modelValue', list);
  }
});
</script>
<style scoped>

</style>
