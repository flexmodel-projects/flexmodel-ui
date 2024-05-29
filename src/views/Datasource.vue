<template>
  <div style="width: 100%">
    <el-table :data="resourceList" style="width: 100%">
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="type" label="类型"/>
      <el-table-column prop="config" label="配置">
        <template #default="{ row }">
          <span>{{ JSON.stringify(row?.config) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"/>
    </el-table>
  </div>
</template>
<script setup lang="ts">
import {ElMessage} from "element-plus";
import {getDatasourceList} from "~/api/datasource";
import {ref} from "vue";

const resourceList = ref<any[]>([]);

const reqDatasourceList = async () => {
  try {
    resourceList.value = await getDatasourceList();
  } catch (error) {
    ElMessage.error(error as Error);
  }
};
reqDatasourceList();
</script>
<style scoped>

</style>
