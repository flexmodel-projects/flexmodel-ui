<template>
  <el-card shadow="never">
    <template #header>
      <el-row>
        <el-col :span="4"><span>Logs</span></el-col>
        <el-col style="text-align: right" :span="20">
          <el-button :icon="Setting"></el-button>
          <el-button :icon="Refresh"></el-button>
        </el-col>
      </el-row>
    </template>
    <el-row>
      <el-col>
        <el-input
          style="width: 100%"
          size="large"
          placeholder="Search keywords"
          :prefix-icon="Search"
        />
      </el-col>
      <el-col>
        <el-table @cellClick="showDetail" row-style="cursor: pointer;" :data="tableData" style="width: 99%">
          <el-table-column prop="level" label="level" width="100">
            <template #default="{ row }">
              <el-tag type="primary" v-if="row.level==='DEBUG'">DEBUG</el-tag>
              <el-tag type="info" v-if="row.level==='INFO'">INFO</el-tag>
              <el-tag type="warning" v-if="row.level==='WARN'">WARN</el-tag>
              <el-tag type="danger" v-if="row.level==='ERROR'">ERROR</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="uri" label="message">
            <template #default="{ row }">
              <el-row style="font-size: 12px;padding: 10px 10px 10px 0;">
                <el-col style="padding: 10px 10px 10px 0;">
                  {{ row.uri }}
                </el-col>
                <el-col>
                  <div class="flex gap-2">
                    <el-tag type="info" size="small">status: {{ row?.data?.status }}</el-tag>
                    <el-tag type="info" size="small">execTime: {{ row?.data?.execTime }}ms</el-tag>
                    <el-tag type="info" size="small">remoteIp: {{ row?.data?.remoteIp }}</el-tag>
                    <el-tag type="danger" v-if="row?.data?.status>=500" size="small">
                      message: {{ row?.data?.message }}
                    </el-tag>
                    <el-tag type="warning" v-else-if="row?.data?.status>=400" size="small">
                      message: {{ row?.data?.message }}
                    </el-tag>
                  </div>
                </el-col>
              </el-row>

            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="createdAt" width="200"/>
        </el-table>
      </el-col>
      <el-col style="text-align: center">
        <el-button v-if="!isOver" class="mt-4" size="large" @click="onAddItem" :loading="isLoading">
          Load more
        </el-button>
      </el-col>
    </el-row>
  </el-card>
  <el-drawer v-model="drawer" title="Request log" size="45%">
    <el-descriptions border column="1">
      <el-descriptions-item label="id">{{ log.id }}</el-descriptions-item>
      <el-descriptions-item label="level">{{ log.level }}</el-descriptions-item>
      <el-descriptions-item label="createdAt">{{ log.createdAt }}</el-descriptions-item>
      <el-descriptions-item label="data.execTime">{{ log.data?.execTime }}ms</el-descriptions-item>
      <el-descriptions-item label="data.status">{{ log.data?.status }}</el-descriptions-item>
      <el-descriptions-item label="data.message">{{ log.data?.message }}</el-descriptions-item>
      <el-descriptions-item label="data.errors">{{ log.data?.errors }}</el-descriptions-item>
      <el-descriptions-item label="data.method">{{ log.data?.method }}</el-descriptions-item>
      <el-descriptions-item label="data.path">{{ log.data?.path }}</el-descriptions-item>
      <el-descriptions-item label="data.userAgent">{{ log.data?.userAgent }}</el-descriptions-item>
      <el-descriptions-item label="data.remoteIp">{{ log.data?.remoteIp }}</el-descriptions-item>
      <el-descriptions-item label="data.referer">{{ log.data?.referer }}</el-descriptions-item>
    </el-descriptions>
  </el-drawer>
</template>
<script setup lang="ts">
import {reactive, ref} from "vue";
import {getApiLogs} from "~/api/api-log";
import {Refresh, Search, Setting} from "@element-plus/icons-vue";
import HidePassword from "~/components/HidePassword.vue";

const isOver = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const tableData = ref<any[]>([])
const index = reactive({count: 1});
const log = ref<any>({});
const drawer = ref(false);
const reqApiLogs = async () => {
  const res: any[] = await getApiLogs(index.count++);
  if (res.length == 0) {
    isOver.value = true;
  }
  tableData.value = res;
}
reqApiLogs();
const showDetail = (row: any) => {
  log.value = row;
  drawer.value = true;
}
const onAddItem = async () => {
  isLoading.value = true;
  const res: any[] = await getApiLogs(index.count++);
  isLoading.value = false;
  isOver.value = res.length < 50;
  if (res.length != 0) {
    debugger
    tableData.value.push(...res);
  }
}
</script>
<style scoped>

</style>
