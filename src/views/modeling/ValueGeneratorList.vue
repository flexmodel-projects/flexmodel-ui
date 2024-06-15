<template>
  <el-input
    v-for="(item, index) in list"
    class="mb-12px"
    readonly
    :model-value="displayValue(item)"
  >
    <template #suffix>
      <el-icon class="mr-6px cursor-pointer hover:text-[el-color-primary]" @click="delItem(index)">
        <Close/>
      </el-icon>
      <el-icon class="cursor-pointer hover:text-[el-color-primary]" @click="editItem(item)">
        <Edit/>
      </el-icon>
    </template>
  </el-input>
  <el-dropdown v-if="list.length < 1" trigger="click" @command="handleCommand">
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
          @click="addItem"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <ValueGenerator v-model="generatorForm"
                  @close="generatorDialogVisible = false"
                  @change="handleChange"
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

const generatorDialogVisible = ref<boolean>(false);
const generatorForm = ref<any>();
const list = ref<any>();

const filteredGeneratorTypes = computed(() => GeneratorTypes[props.field?.type]);

const handleCommand = (command: string) => {
  generatorForm.value = {type: command, generationTime: 'INSERT'};
  generatorDialogVisible.value = true;
}
const handleChange = (item: any) => {
  list.value = [item];
}
const displayValue = (item: any) => {
  return `${item.type}: ${JSON.stringify(item)}`;
}
const addItem = () => {
  generatorDialogVisible.value = true;
  // emits('update:modelValue', generatorForm.value);
}
const delItem = (index: number) => {
  list.value = [];
  // emits('update:modelValue', null);
}
const editItem = (item: any) => {
  generatorDialogVisible.value = true;
  generatorForm.value = item;
  // emits('update:modelValue', generatorForm.value);
}

watchEffect(() => {
  if (props?.field.type) {
    list.value = [];
  }
});
watchEffect(() => {
  if (generatorForm.value) {
    list.value = [generatorForm.value];
  }
})
watchEffect(() => {
  if (props.modelValue) {
    generatorForm.value = props.modelValue;
  }
});
</script>
<style scoped>

</style>
