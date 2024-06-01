<template>
  <el-row>
    <el-col>
      <el-card shadow="never">
        <el-row>
          <el-col :span="12">
            <el-select v-model="selectedDs" placeholder="数据源" style="width: 200px">
              <el-option
                v-for="item in dsList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-segmented v-model="view" :options="options"/>
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
            placeholder="搜索"
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
          <el-button type="primary" @click="toggleSelection()" style="width: 100%">新建模型</el-button>
        </div>
      </el-card>
    </el-col>
    <el-col :span="20">
      <el-row v-if="view==='struct'">
        <el-col>
          <el-card>
            <el-row>
              <el-col :span="12">{{ activeModel?.name }}
                {{ activeModel?.comment }}
              </el-col>
              <el-col :span="12" style="text-align: right">
                <el-button type="info">编辑</el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col>
          <el-card shadow="never">
            <el-table :data="activeModel?.fields" style="width: 100%">
              <el-table-column label="名称" prop="name"/>
              <el-table-column label="类型" prop="type"/>
              <el-table-column label="是否唯一" prop="unique"/>
              <el-table-column label="可为空" prop="nullable"/>
              <el-table-column label="备注" prop="comment"/>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-row v-if="view==='data'">
        <el-col>
          <el-card>
            <el-row>
              <el-col :span="12">{{ activeModel?.name }}
                {{ activeModel?.comment }}
              </el-col>
              <el-col :span="12" style="text-align: right">
                <el-button type="info">新增</el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col>
          <el-card shadow="never">
            <el-table :data="recordList" style="width: 100%">
              <el-table-column v-for="item in activeModel?.fields" :label="item.name" :prop="item.name"/>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import {ElMessage} from "element-plus";
import {getModelList} from "~/api/model";
import {computed, ref, watchEffect} from "vue";
import {getDatasourceList} from "~/api/datasource";
import {getRecordList} from "~/api/record";

const options = [
  {
    label: '结构',
    value: 'struct',
  },
  {
    label: '数据',
    value: 'data',
  }
]
const view = ref<string>('struct');
const dsList = ref<Datasource[]>([]);
const selectedDs = ref<string>();
const modelList = ref<any[]>([]);
const recordList = ref<any[]>([]);
const activeModel = ref<any>({});
const searchQuery = ref<string>();

const reqDatasourceList = async () => {
  try {
    const res = await getDatasourceList();
    dsList.value = res;
    selectedDs.value = res[0].name;
  } catch (error) {
    ElMessage.error(error as Error);
  }
};
const reqModelList = async () => {
  try {
    modelList.value = await getModelList(selectedDs.value);
    activeModel.value = modelList.value[0]
  } catch (error) {
    ElMessage.error(error as Error);
  }
};
const reqRecordList = async () => {
  try {
    recordList.value = await getRecordList(selectedDs.value, activeModel.value?.name);
  } catch (error) {
    ElMessage.error(error as Error);
  }
};
reqDatasourceList();

watchEffect(() => {
  if (selectedDs.value) {
    reqModelList();
  }
});
watchEffect(() => {
  if (activeModel.value?.name) {
    reqRecordList();
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
