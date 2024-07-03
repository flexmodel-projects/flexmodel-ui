<template>
  <el-card shadow="never">
    <template #header>
      <el-row>
        <el-col :span="4"><span>Logs</span></el-col>
        <el-col style="text-align: right" :span="20">
          <el-button :icon="Setting"></el-button>
          <el-button :icon="Refresh" @click="refreshLog" :loading="isLoading"></el-button>
        </el-col>
      </el-row>
    </template>
    <el-row>
      <el-col>
        <el-input
          style="width: 100%"
          v-model="filter"
          size="large"
          placeholder="Search keywords"
          :prefix-icon="Search"
        />
      </el-col>
      <el-col>
        <div id="logStat" ref="logStatRef"></div>
      </el-col>
      <el-col>
        <div style="width: 99%; padding: 5px;">
          <el-table @cellClick="showDetail" row-style="cursor: pointer;" :data="tableData" style="width: 100%">
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
                      <el-tag type="info" size="small" v-if="row?.data?.remoteIp">remoteIp: {{
                          row?.data?.remoteIp
                        }}
                      </el-tag>
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
        </div>
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
import {onMounted, reactive, ref, watchEffect} from "vue";
import {getApiLogs, getApiLogStat} from "~/api/api-log";
import {Refresh, Search, Setting} from "@element-plus/icons-vue";
import * as echarts from 'echarts';

const option = reactive<any>({
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    top: '15%',
    left: '3%',
    right: '3%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    splitNumber: 2,
    type: 'value'
  },
  series: [
    {
      name: 'Total requests',
      type: 'line',
      stack: 'Total',
      data: []
    }
  ]
});

const isOver = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const tableData = ref<any[]>([])
const index = ref({count: 1});
const log = ref<any>({});
const drawer = ref(false);
const filter = ref<string>('');
const logStatRef = ref({});

const reqApiLogs = async () => {
  const res: any[] = await getApiLogs(index.value.count++, 50, filter.value);
  if (res.length == 0) {
    isOver.value = true;
  }
  tableData.value = res;
}
const reqApiLogStat = async () => {
  const statList: any[] = await getApiLogStat(filter.value);
  option.xAxis.data = statList.map(stat => stat.date);
  option.series[0].data = statList.map(stat => stat.total);
  const myChart = echarts.init(logStatRef.value);
  myChart.setOption(option)
}

const showDetail = (row: any) => {
  log.value = row;
  drawer.value = true;
}
const onAddItem = async () => {
  isLoading.value = true;
  const res: any[] = await getApiLogs(index.value.count++);
  isLoading.value = false;
  isOver.value = res.length < 50;
  if (res.length != 0) {
    tableData.value.push(...res);
  }
}
const refreshLog = async () => {
  isLoading.value = true;
  index.value.count = 1;
  const res: any[] = await getApiLogs(1);
  isLoading.value = false;
  if (res.length == 0) {
    isOver.value = true;
  }
  tableData.value = res;
  await reqApiLogStat();
}


watchEffect(() => {
  if (filter.value) {
    index.value.count = 1;
    reqApiLogs();
    reqApiLogStat();
  }
});
onMounted(() => {
  reqApiLogs();
  reqApiLogStat();
});
</script>
<style scoped>
#logStat {
  width: 98%;
  height: 250px;
}
</style>
