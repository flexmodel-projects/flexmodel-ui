<template>
  <el-row>
    <el-col>
      <el-card shadow="never">
        <el-row>
          <el-col :span="12">
            Data modeling
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
        <SelectModel :datasource="activeDs" @change="handleItemChange"/>
        <el-divider/>
        <el-button type="primary" :icon="Plus" @click="drawerVisible = true" style="width: 100%" plain>Create model
        </el-button>
      </el-card>
    </el-col>
    <el-col :span="20">
      <Model v-if="viewMode==='model'" :datasource="activeDs" :model="activeModel"/>
      <ModelIndex v-if="viewMode==='index'" :datasource="activeDs" :model="activeModel"/>
      <Record v-if="viewMode==='record'" :datasource="activeDs" :model="activeModel"/>
    </el-col>
  </el-row>
  <CreateModel v-model="drawerVisible" @close="drawerVisible=false"/>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import Record from "~/views/modeling/Record.vue";
import Model from "~/views/modeling/Model.vue";
import SelectModel from "~/components/SelectModel.vue";
import {Plus} from "@element-plus/icons-vue";
import ModelIndex from "~/views/modeling/ModelIndex.vue";
import CreateModel from "~/views/modeling/CreateModel.vue";

const route = useRoute(), router = useRouter()
const {datasource} = route.query as Record<string, string>;
const options = [
  {
    label: 'Model',
    value: 'model',
  },
  {
    label: 'Index',
    value: 'index',
  },
  {
    label: 'Record',
    value: 'record',
  }
]
const viewMode = ref<string>('model');
const activeDs = ref<string>(datasource);
const activeModel = ref<any>({});
const drawerVisible = ref(false);
if (activeDs.value) {
  router.push({path: '/modeling', query: {datasource: activeDs.value}});
}
const handleItemChange = (ds: string, item: any) => {
  activeDs.value = ds;
  activeModel.value = item;
}
</script>
<style scoped lang="scss">
.datasource-wrap {
  position: relative;
  padding: 5px;

  .ds-item {
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
