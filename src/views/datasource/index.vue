<template>
  <el-row>
    <el-col :span="4">
      <el-card shadow="never">
        <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">DS management</div>
        <el-divider/>
        <el-tree-v2
          v-loading="dsLoading"
          node-key="name"
          :data="dsList"
          :highlight-current="true"
          :current-node-key="activeDs?.name"
          :props="treeProps"
          @node-click="handleItemChange"
        >
          <template #default="{ node, data }">
            <div>
              <el-icon class="p-2" size="15">
                <component :is="DbsMap[data.config?.dbKind]"/>
              </el-icon>
            </div>
            <div class="tree-item-content">
              <span>{{ node.label }}</span>
            </div>
            <div class="absolute right-12px">
              <el-dropdown trigger="hover">
                <el-icon class="tree-item-more invisible" @click.stop>
                  <More/>
                </el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :disabled="data.type==='system'" @click.stop="deleteVisible=true; activeDs=data;">
                      <span class="text-#f56c6c">Delete</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-tree-v2>
        <el-divider/>
        <div>
          <el-button type="primary" :icon="Connection" @click="drawerVisible = true" style="width: 100%" plain>
            Connect Database
          </el-button>
        </div>
      </el-card>
    </el-col>
    <el-col :span="20">
      <el-row>
        <el-col>
          <el-card shadow="never">
            <el-row>
              <el-col :span="12">{{ activeDs.name }}</el-col>
              <el-col :span="12" style="text-align: right">
                <el-button @click="router.push(`/modeling?datasource=${activeDs.name}`)">Modeling</el-button>
                <el-button @click="refreshDatasource" :loading="refreshLoading">Refresh</el-button>
                <el-button @click="tesConnection" :loading="testLoading">Test</el-button>
                <el-button type="primary" :disabled="activeDs.type==='system'" @click="editVisible = true">Edit
                </el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col>
          <el-card shadow="never">
            <DatabaseInfo :datasource="activeDs"/>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
  <ConnectDatabase v-model:visible="drawerVisible" @change="onChangeDatasource" @close="drawerVisible = false"/>
  <EditDSConfig :visible="editVisible" @conform="editDatabase" @cancel="editVisible = false"
                @close="editVisible = false"
                :datasource="activeDs"
                v-model="activeDs.config"/>
  <el-dialog
    v-model="deleteVisible"
    :title="`Delete '${activeDs?.name}?'`"
    width="500"
  >
    <span>Are you sure you want to delete <span class="font-bold">{{ activeDs?.name }}</span>?</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="deleteVisible = false">Cancel</el-button>
        <el-button type="danger" @click="handleDelete">
          Delete
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import {ElMessage} from "element-plus";
import {
  deleteDatasource,
  getDatasourceList,
  refreshDatasource as reqRefreshDatasource,
  updateDatasource,
  validateDatasource
} from "~/api/datasource";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {Connection, More} from "@element-plus/icons-vue";
import ConnectDatabase from "~/views/datasource/ConnectDatabase.vue";
import {Datasource, DbsMap} from "~/types";
import DatabaseInfo from "~/views/datasource/DatabaseInfo.vue";
import EditDSConfig from "~/views/datasource/EditDSConfig.vue";

const treeProps = {
  value: 'name',
  children: 'children',
  label: 'name',
}

const router = useRouter();

const drawerVisible = ref<boolean>(false);
const editVisible = ref<boolean>(false);
const deleteVisible = ref<boolean>(false);
const dsList = ref<Datasource[]>([]);
const activeDs = ref<Datasource>({config: {dbKind: ""}, createTime: "", name: "", type: ""});
const dsLoading = ref<boolean>(false);
const refreshLoading = ref<boolean>(false);
const testLoading = ref<boolean>(false);

const reqDatasourceList = async () => {
  try {
    dsLoading.value = true;
    dsList.value = await getDatasourceList();
    dsLoading.value = false;
    activeDs.value = dsList.value[0];
  } catch (error) {
    ElMessage.error(error as Error);
  }
};
const refreshDatasource = async () => {
  refreshLoading.value = true;
  await reqRefreshDatasource(activeDs.value.name);
  refreshLoading.value = false;
  ElMessage.success('Refresh succeed');
}
const tesConnection = async () => {
  testLoading.value = true;
  const result = await validateDatasource(activeDs.value);
  testLoading.value = false;
  if (result.success) {
    ElMessage.success(`Succeed, ping: ${result.time}ms`);
  } else {
    ElMessage.error(`Failed, error msg: ${result.errorMsg}`);
  }
}
const onChangeDatasource = () => {
  reqDatasourceList();
  refreshDatasource();
}
const editDatabase = async () => {
  await updateDatasource(activeDs.value.name, activeDs.value);
  editVisible.value = false
}
const handleItemChange = (item: Datasource) => {
  activeDs.value = item;
  console.log(activeDs.value);
}
const handleDelete = async () => {
  await deleteDatasource(activeDs.value?.name);
  await reqDatasourceList();
  deleteVisible.value = false;
}

onMounted(() => {
  reqDatasourceList();
});
</script>
<style scoped lang="scss">
.ep-tree-node {
  &:hover {
    .tree-item-more {
      visibility: visible;
    }
  }
}
</style>
