<template>
  <div>
    <el-select v-model="activeDs" placeholder="Data source" style="width: calc(100% - 50px);">
      <el-option
        v-for="item in dsList"
        :key="item.name"
        :value="item.name">
        <template #default>
          <el-icon class="p-1">
            <component :is="DbsMap[item.config?.dbKind]"/>
          </el-icon>
          {{ item.name }}
        </template>
      </el-option>
      <template #footer>
        <el-button @click="router.push('/datasource')" type="primary" :icon="Edit" style="width: 100%" link>
          Management
        </el-button>
      </template>
    </el-select>
    <el-button class="ml-1" :icon="Refresh"/>
  </div>
  <el-divider/>
  <div>
    <el-input
      style="width: 100%"
      placeholder="Search models"
      v-model="searchQuery"
      clearable
    >
    </el-input>
  </div>
  <el-divider/>
  <el-scrollbar :style="{height: props.height||'300px'}">
    <div class="datasource-wrap">
      <div
        class="ds-item"
        :class="{ 'ds-item-active': item.name === activeModel?.name }"
        v-for="(item, index) in filteredItems"
        :key="index"
        @click="handleItemChange(item)"
      >
        <el-icon class="p-2">
          <Document/>
        </el-icon>
        {{ item.name }}
      </div>
    </div>
  </el-scrollbar>
</template>
<script setup lang="ts">

import {DbsMap} from "~/types";
import {Document, Edit, Refresh} from "@element-plus/icons-vue";
import {computed, ref, watchEffect} from "vue";
import {getDatasourceList} from "~/api/datasource";
import {useRouter} from "vue-router";
import {getModelList} from "~/api/model";


const props = defineProps(['datasource', 'height']);
const emits = defineEmits(['onChange']);

const router = useRouter()
const activeDs = ref<string>(props.datasource);
const activeModel = ref<any>({});
const dsList = ref<Datasource[]>([]);
const modelList = ref<any[]>([]);

const reqDatasourceList = async () => {
  const res = await getDatasourceList();
  dsList.value = res;
  activeDs.value = props.datasource || res[0].name;
};
const reqModelList = async () => {
  const res: any = await getModelList(activeDs.value);
  modelList.value = res;
  activeModel.value = res[0];
  emits('change', activeDs.value, res[0]);
};
watchEffect(() => {
  if (activeDs.value) {
    reqModelList();
  }
});
reqDatasourceList();
const searchQuery = ref<string>();
const filteredItems = computed(() => {
  if (!searchQuery.value) {
    return modelList.value;
  }
  return modelList.value.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value?.toLowerCase())
  );
});
const handleItemChange = (item: any) => {
  activeModel.value = item;
  emits('change', activeDs.value, item);
}
</script>
<style scoped lang="scss">
.datasource-wrap {
  position: relative;
  padding: 5px;

  .ds-item {
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    padding: 0 4px;

    &:hover {
      background-color: #f5f7fa;
    }

    &-active {
      background-color: #ecf5ff;
    }
  }
}
</style>
