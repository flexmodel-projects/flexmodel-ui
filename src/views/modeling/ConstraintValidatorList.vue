<template>
  <el-input
    v-for="(item, index) in list"
    :key="index"
    class="mb-12px"
    readonly
    :model-value="displayGeneratorValue(item)"
  >
    <template #suffix>
      <el-icon class="mr-6px cursor-pointer hover:text-[el-color-primary]" @click="delGeneratorItem(index)">
        <Close/>
      </el-icon>
      <el-icon class="cursor-pointer hover:text-[el-color-primary]" @click="editGeneratorItem( item)">
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
          @click="validatorDialogVisible = true"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <ConstraintValidator v-model="validatorForm"
                       @close="validatorDialogVisible = false"
                       @add="(item:any)=>list.push(item)"
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
const filteredValidatorTypes = computed(() => ValidatorTypes[props.field?.type]);
const validatorDialogVisible = ref<boolean>(false);
const validatorForm = ref<any>({});
const handleCommand = (command: string) => {
  validatorForm.value.type = command;
  validatorDialogVisible.value = true;
}
const list = ref<any[]>([]);
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
const displayGeneratorValue = (item: any) => {
  return `${item.type}: ${item.value}`;
}
const delGeneratorItem = (index: number) => {
  list.value.splice(index, 1);
}
const editGeneratorItem = (item: any) => {
  validatorDialogVisible.value = true;
  validatorForm.value = item;
}
</script>
<style scoped>

</style>
