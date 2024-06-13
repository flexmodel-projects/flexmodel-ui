<template>
  <el-row>
    <el-col :span="4">
      <el-card shadow="never">
        <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">DS management</div>
        <el-divider/>
        <div class="datasource-wrap">
          <div
            class="ds-item"
            :class="{ 'ds-item-active': item.name === activeDs.name }"
            v-for="(item, index) in dsList"
            :key="index"
            @click="handleItemChange(item)"
          >
            <el-icon class="p-2" size="15">
              <component :is="DbsMap[item.config?.dbKind]"/>
            </el-icon>
            {{ item.name }}
            <div class="absolute right-12px">
              <el-dropdown trigger="hover">
                <el-icon class="icon-hover invisible" @click.stop>
                  <More/>
                </el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :disabled="activeDs.type==='system'" @click.stop="deleteVisible=true; activeDs=item;">
                      <span class="text-#f56c6c">Delete</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
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
  <ConnectDatabase :visible="drawerVisible" @change="onChangeDatasource" @close="drawerVisible = false"/>
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
import {ref} from "vue";
import {useRouter} from "vue-router";
import {Connection, More} from "@element-plus/icons-vue";
import ConnectDatabase from "~/views/datasource/ConnectDatabase.vue";
import {Datasource, DbsMap} from "~/types";
import DatabaseInfo from "~/views/datasource/DatabaseInfo.vue";
import EditDSConfig from "~/views/datasource/EditDSConfig.vue";

const drawerVisible = ref<boolean>(false);
const editVisible = ref<boolean>(false);
const deleteVisible = ref<boolean>(false);
const router = useRouter();
const dsList = ref<Datasource[]>([]);
const activeDs = ref<Datasource>({});
const refreshLoading = ref<boolean>(false);
const testLoading = ref<boolean>(false);
const reqDatasourceList = async () => {
  try {
    dsList.value = await getDatasourceList();
    activeDs.value = dsList.value[0]
  } catch (error) {
    ElMessage.error(error as Error);
  }
};
reqDatasourceList();
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
}
const handleDelete = async () => {
  await deleteDatasource(activeDs.value?.name);
  await reqDatasourceList();
  deleteVisible.value = false;
}
</script>
<style scoped lang="scss">
.datasource-wrap {
  position: relative;
  padding: 5px;

  .ds-item {
    font-size: var(--ep-font-size-base);
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    padding: 0 4px;

    &:hover {
      background-color: var(--ep-fill-color-light);

      .icon-hover {
        visibility: visible;
        top: 10px;
      }
    }

    &-active {
      background-color: var(--ep-fill-color-light);
    }
  }
}


</style>
