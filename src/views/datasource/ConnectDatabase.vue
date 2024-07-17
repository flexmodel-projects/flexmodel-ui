<template>
  <el-drawer @close="active=0" v-model="visible" title="Connect Database" size="50%">
    <div style="padding-bottom: 20px">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="Select Database"/>
        <el-step title="Connect Database"/>
      </el-steps>
    </div>
    <el-form
      label-position="top"
      label-width="auto"
      :model="form"
    >
      <div v-if="active==0">
        <el-form-item class="mb-2 flex items-center text-sm"
                      label="Please select your database to connect.">
          <div class="mb-2 flex items-center text-sm">
            <el-radio-group class="ml-4" v-model="form.config.dbKind">
              <div class="segment-title">Relational</div>
              <el-radio value="mysql" border>MySQL</el-radio>
              <el-radio value="mariadb" border>MariaDB</el-radio>
              <el-radio value="oracle" border>Oracle</el-radio>
              <el-radio value="sqlserver" border>SQL Server</el-radio>
              <el-radio value="postgresql" border>PostgreSQL</el-radio>
              <el-radio value="db2" border>DB2</el-radio>
              <el-radio value="sqlite" border>SQLite</el-radio>
              <el-radio value="gbase" border>GBase</el-radio>
              <el-radio value="dm" border>DM8</el-radio>
              <el-radio value="tidb" border>TiDB</el-radio>
              <div class="segment-title">Document</div>
              <el-radio value="mongodb" border>MongoDB</el-radio>
              <div class="segment-title">Other</div>
              <el-radio value="graphql" border disabled>GraphQL</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </div>
      <div v-if="active==1">
        <el-form-item required label="Connection name">
          <el-input v-model="form.name"/>
        </el-form-item>
      </div>
    </el-form>
    <div v-if="active==1">
      <MySQLConfig v-if="form.config.dbKind === 'mysql'" v-model="form.config"/>
      <SQLiteConfig v-else-if="form.config.dbKind === 'sqlite'" v-model="form.config"/>
      <CommonConfig v-else v-model="form.config"/>
    </div>
    <div v-if="active==2">
      <el-row>
        <el-col class="pb5">
          <span class="text-center">Connected successfully</span>
        </el-col>
        <el-col>
          <DatabaseInfo :datasource="form"/>
        </el-col>
        <el-col class="text-center">
          <el-button style="margin-top: 12px" @click="visible = false">Close</el-button>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <el-button style="margin-top: 12px" @click="prev" v-if="active!=0 && active!=2">Go back</el-button>
      <el-button type="primary" style="margin-top: 12px" @click="next" v-if="active==0">Select Database</el-button>
      <el-button style="margin-top: 12px" @click="tesConnection" v-if="active==1">Test Connection</el-button>
      <el-button type="primary" style="margin-top: 12px" @click="connectDatabase" v-if="active==1">Connect Database
      </el-button>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import {reactive, ref} from "vue";
import MySQLConfig from "~/views/datasource/MySQLConfig.vue";
import CommonConfig from "~/views/datasource/CommonConfig.vue";
import SQLiteConfig from "~/views/datasource/SQLiteConfig.vue";
import {createDatasource, validateDatasource} from "~/api/datasource";
import DatabaseInfo from "~/views/datasource/DatabaseInfo.vue";
import {ElMessage} from "element-plus";

const emits = defineEmits(['change']);

const visible = defineModel('visible');

const form = reactive<any>({config: {dbKind: 'mysql'}});
const active = ref(0);

const prev = () => {
  if (active.value-- < 0) active.value = 0;
}
const next = () => {
  if (active.value++ > 2) active.value = 0;
}
const tesConnection = async () => {
  const result = await validateDatasource(form);
  if (result.success) {
    ElMessage.success(`Succeed, ping: ${result.time}ms`);
  } else {
    ElMessage.error(`Failed, error msg: ${result.errorMsg}`);
  }
}
const connectDatabase = async () => {
  const result = await validateDatasource(form);
  if (result.success) {
    const res = await createDatasource(form);
    next();
    emits('change', res);
  } else {
    ElMessage.error(`Failed, error msg: ${result.errorMsg}`);
  }
}

</script>
<style scoped>
.ep-radio {
  margin: 5px;
}

.ep-radio-group {
  display: flex;
  align-items: center;
}

.segment-title {
  font-size: 14px;
  width: 100%;
  font-weight: 600;
  padding-bottom: 10px;
  padding-top: 10px;
}
</style>
