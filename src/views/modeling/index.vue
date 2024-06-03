<template>
  <el-row>
    <el-col>
      <el-card shadow="never">
        <el-row>
          <el-col :span="12">
            Data source
            <el-select v-model="activeDs" placeholder="Data source" style="width: 150px">
              <el-option
                v-for="item in dsList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
              <template #footer>
                <el-button @click="router.push('/datasource')" type="primary" :icon="Edit" style="width: 100%" link>
                  Management
                </el-button>
              </template>
            </el-select>
            <el-button type="primary" :icon="Refresh">Refresh</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-segmented v-model="viewMode" :options="options"/>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="4">
      <el-card shadow="never">
        <div>
          <el-input
            style="width: 100%"
            placeholder="Search"
            v-model="searchQuery"
            clearable
          >
          </el-input>
        </div>
        <el-divider/>
        <div class="datasource-wrap" style="height: 360px;overflow-y: scroll">
          <div
            class="ds-item"
            :class="{ 'ds-item-active': item.name === activeModel?.name }"
            v-for="(item, index) in filteredItems"
            :key="index"
            @click="handleItemChange(item)"
          >
            {{ item.name }}
          </div>
        </div>
        <el-divider/>
        <div>
          <el-button type="primary" :icon="Plus" @click="toggleSelection()" style="width: 100%" plain>Create model</el-button>
        </div>
      </el-card>
    </el-col>
    <el-col :span="20">
      <Model v-if="viewMode==='model'" :datasource="activeDs" :model="activeModel"/>
      <Record v-if="viewMode==='record'" :datasource="activeDs" :model="activeModel"/>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import {getModelList} from "~/api/model";
import {computed, ref, watchEffect} from "vue";
import {getDatasourceList} from "~/api/datasource";
import {Edit, Refresh, Plus} from "@element-plus/icons-vue";
import {useRoute, useRouter} from "vue-router";
import Record from "~/views/modeling/Record.vue";
import Model from "~/views/modeling/Model.vue";

const route = useRoute(), router = useRouter()
const {datasource} = route.query as Record<string, string>;
const options = [
  {
    label: 'Model',
    value: 'model',
  },
  {
    label: 'Record',
    value: 'record',
  }
]
const viewMode = ref<string>('model');
const activeDs = ref<string>(datasource);
const activeModel = ref<any>({});
const searchQuery = ref<string>();

const dsList = ref<Datasource[]>([]);
const modelList = ref<any[]>([]);

const reqDatasourceList = async () => {
  const res = await getDatasourceList();
  dsList.value = res;
  activeDs.value = datasource || res[0].name;
};
const reqModelList = async () => {
  const res: any = await getModelList(activeDs.value);
  modelList.value = res;
  activeModel.value = res[0];
};
reqDatasourceList();
watchEffect(() => {
  if (activeDs.value) {
    reqModelList();
    router.push({path: '/modeling', query: {datasource: activeDs.value}});
  }
});

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
