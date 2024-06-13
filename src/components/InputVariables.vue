<template>
  <el-input v-model="input" :placeholder="placeholder" clearable>
    <template #suffix>
      <el-dropdown trigger="click">
        <el-button title="Add variables" @click.stop size="small" link>{...}</el-button>
        <template #dropdown>
          <el-dropdown-menu style="height: 300px">
            <el-dropdown-item :key="item" v-for="item in variableKeys" @click.stop="selectVariable(item)">
              {{ item }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </el-input>
</template>
<script setup lang="ts">
import {computed, ref, watchEffect} from "vue";
import {getVariables} from "~/api/environment";

const props = defineProps(['modelValue', 'placeholder']);
const emits = defineEmits(['update:modelValue']);
const input = ref<string>('');
const variables = ref<any[]>([]);
const reqVariables = async () => {
  variables.value = await getVariables()
}
reqVariables();
const variableKeys = computed(() => {
  const list = [];
  list.push(...Object.keys(variables.value['environment'] || {}));
  list.push(...Object.keys(variables.value['system'] || {}));
  return list;
});
const selectVariable = (item: string) => {
  input.value += `{{${item}}}`;
}
watchEffect(() => {
  if (input.value) {
    emits('update:modelValue', input.value);
  }
});
watchEffect(() => {
  if (props.modelValue) {
    input.value = props.modelValue;
  }
});
</script>
<style scoped>

</style>
