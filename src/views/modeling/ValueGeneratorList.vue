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
  <ValueGenerator :current-value="form"
                  @close="dialogVisible = false"
                  @change="handleChange"
                  v-model:visible="dialogVisible"
                  :field="field"/>
</template>
<script setup lang="ts">
import {computed, reactive, ref, watchEffect} from "vue";
import {GeneratorTypes} from "~/types";
import {ArrowDown, Close, Edit, Plus} from "@element-plus/icons-vue";
import ValueGenerator from "~/views/modeling/ValueGenerator.vue";

const props = defineProps(['datasource', 'model', 'field']);

const dialogVisible = ref<boolean>(false);
const form = reactive<any>({});
const list = ref<any>([]);
const gen = defineModel<any>({});
const filteredGeneratorTypes = computed(() => GeneratorTypes[props.field?.type]);

const handleCommand = (command: string) => {
  Object.assign(form, {type: command, generationTime: 'INSERT'});
  dialogVisible.value = true;
}
const handleChange = (item: any) => {
  dialogVisible.value = false
  list.value = [item];
  gen.value = item;
}
const displayValue = (item: any) => {
  return `${item.type}: ${JSON.stringify(item)}`;
}
const addItem = () => {
  Object.assign(form, {});
  dialogVisible.value = true;
}
const delItem = (index: number) => {
  list.value = [];
  gen.value = null;
}
const editItem = (item: any) => {
  dialogVisible.value = true;
  Object.assign(form, item);
}

watchEffect(() => {
  if (props?.field.type) {
    list.value = [];
  }
});
watchEffect(() => {
  if (gen.value) {
    list.value = [{...gen.value}];
  }
});
</script>
<style scoped>

</style>
