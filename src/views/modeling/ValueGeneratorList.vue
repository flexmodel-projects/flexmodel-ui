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
          v-for="(item, index) in filteredGeneratorTypes"
          :key="index"
          :command="item.name"
          @click="generatorDialogVisible = true"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <ValueGenerator v-model="generatorForm"
                  @close="generatorDialogVisible = false"
                  @add="(item:any)=>list.push(item)"
                  :visible="generatorDialogVisible"
                  :field="field"/>
</template>
<script setup lang="ts">
import {computed, ref, watchEffect} from "vue";
import {GeneratorTypes} from "~/types";
import {ArrowDown, Close, Edit, Plus} from "@element-plus/icons-vue";
import ValueGenerator from "~/views/modeling/ValueGenerator.vue";

const props = defineProps(['modelValue', 'datasource', 'model', 'field']);
const emits = defineEmits(['update:modelValue']);
const filteredGeneratorTypes = computed(() => GeneratorTypes[props.field?.type]);
const generatorDialogVisible = ref<boolean>(false);
const generatorForm = ref<any>({});
const handleCommand = (command: string) => {
  generatorForm.value.type = command;
  generatorDialogVisible.value = true;
}
const list = ref<any[]>([]);
watchEffect(() => {
  if (props?.field.type) {
    list.value = [];
  }
})
const displayGeneratorValue = (item: any) => {
  return `${item.type}: ${item.value}`;
}
watchEffect(() => {
  if (list.value) {
    emits('update:modelValue', list);
  }
});
const delGeneratorItem = (index: number) => {
  list.value.splice(index, 1);
}
const editGeneratorItem = (item: any) => {
  generatorDialogVisible.value = true;
  generatorForm.value = item;
}
</script>
<style scoped>

</style>
