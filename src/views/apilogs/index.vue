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
        <el-table :data="tableData" style="width: 99%">
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
          <el-table-column fixed="right" label="Operations" width="150">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click.prevent="showDetail(scope.$index)"
              >
                Detail
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col style="text-align: center">
        <el-button v-if="!isOver" class="mt-4" size="large" @click="onAddItem" :loading="isLoading">
          Load more
        </el-button>
      </el-col>
    </el-row>
  </el-card>
</template>
<script setup lang="ts">
import {reactive, ref} from "vue";
import {getApiLogs} from "~/api/api-log";
import {Refresh, Search, Setting} from "@element-plus/icons-vue";

const isOver = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const tableData = ref<any[]>([])
const index = reactive({count: 1})
const reqApiLogs = async () => {
  const res: any[] = await getApiLogs(index.count++);
  if (res.length == 0) {
    isOver.value = true;
  }
  tableData.value = res;
}
reqApiLogs();
const showDetail = (index: number) => {
  // tableData.value.splice(index, 1)
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
