<template>
  <el-row>
    <el-col>
      <el-card shadow="never">
        <el-row>
          <el-col :span="12">
            Data modeling
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-segmented v-model="selectedItem" :options="options"/>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="4">
      <el-card shadow="never">
        <SelectModel ref="selectModelRef" :datasource="activeDs" @change="handleItemChange" :editable="true"/>
        <el-divider/>
        <el-button type="primary" :icon="Plus" @click="drawerVisible = true" style="width: 100%" plain>New model
        </el-button>
      </el-card>
    </el-col>
    <el-col :span="20">
      <FieldList v-if="selectedItem==='field'"
                 :datasource="activeDs"
                 :model="activeModel"
                 v-model="activeModel.fields"/>
      <IndexList v-if="selectedItem==='index'"
                 :datasource="activeDs"
                 :model="activeModel"
                 v-model="activeModel.indexes"/>
      <RecordList v-if="selectedItem==='record'" :datasource="activeDs" :model="activeModel"/>
    </el-col>
  </el-row>
  <CreateModel
    v-model="drawerVisible"
    :datasource="activeDs"
    @conform="addModel"
    @cancel="drawerVisible = false"
  />
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import Record from "~/views/modeling/Record.vue";
import SelectModel from "~/components/SelectModel.vue";
import {Plus} from "@element-plus/icons-vue";
import CreateModel from "~/views/modeling/CreateModel.vue";
import FieldList from "~/views/modeling/FieldList.vue";
import IndexList from "~/views/modeling/IndexList.vue";
import RecordList from "~/views/modeling/RecordList.vue";
import {createModel as reqCreateModel} from "~/api/model";

const route = useRoute(), router = useRouter()
const {datasource} = route.query as Record<string, string>;
const options = [
  {
    label: 'Field',
    value: 'field',
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
const selectedItem = ref<string>('field');
const activeDs = ref<string>(datasource);
const activeModel = ref<any>({});
const drawerVisible = ref(false);
const selectModelRef = ref<any>();
const handleItemChange = (ds: string, item: any) => {
  activeDs.value = ds
  activeModel.value = item
}
const addModel = async (item: any) => {
  await reqCreateModel(activeDs.value, item);
  drawerVisible.value = false;
  selectModelRef.value.reload();
}
onMounted(() => {
  if (activeDs.value) {
    router.push({path: '/modeling', query: {datasource: activeDs.value}});
  }
});
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
