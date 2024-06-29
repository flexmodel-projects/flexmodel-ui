<template>
  <el-input v-model="input" :placeholder="placeholder">
    <template #suffix>
      <el-dropdown trigger="click" @command="handleCommand">
        <el-button title="Add variables" @click.stop size="small" link>{...}</el-button>
        <template #dropdown>
          <el-dropdown-menu style="height: 300px">
            <el-dropdown-item :command="item" v-for="item in variableKeys">
              {{ item }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </el-input>
</template>
<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {getVariables} from "~/api/environment";

const props = defineProps(['placeholder']);

const input = defineModel<string>({required: true});
const variables = ref<any[]>([]);

const reqVariables = async () => {
  variables.value = await getVariables()
}
const variableKeys = computed(() => {
  const list = [];
  list.push(...Object.keys(variables.value['environment'] || {}));
  list.push(...Object.keys(variables.value['system'] || {}));
  return list;
});
const handleCommand = (command: string) => {
  input.value = "${" + command + "}";
}

onMounted(() => {
  reqVariables();
});
</script>
<style scoped>

</style>
