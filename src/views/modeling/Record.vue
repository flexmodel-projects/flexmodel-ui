<template>
  <el-row>
    <el-col>
      <el-card>
        <el-row>
          <el-col :span="12">{{ model?.name }}
            {{ model?.comment }}
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button type="info">New record</el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col>
      <el-card shadow="never">
        <el-table :data="recordList" style="width: 100%">
          <el-table-column v-for="item in model?.fields" :label="item.name" :prop="item.name">
            <template #default="{ row }">
              {{ row[item.name] }}
            </template>
          </el-table-column>
          <el-table-column label="Operation" width="200" fixed="right">
            <template #default="scope">
              <el-button type="primary" link @click="handleEdit(scope.$index, scope.row)">
                Edit
              </el-button>
              <el-button type="primary" link @click="handleDelete(scope.row)">
                Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import {ref, watchEffect} from "vue";
import {getRecordList} from "~/api/record";

const props = defineProps(['datasource', 'model']);
const recordList = ref<any[]>([]);
const reqRecordList = async () => {
  recordList.value = await getRecordList(props.datasource, props.model?.name);
};
watchEffect(() => {
  if (props.model) {
    reqRecordList();
  }
});
</script>
<style scoped>

</style>
