<template>
  <el-row>
    <el-col :span="4">
      <el-card shadow="never">
        <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">IdP management</div>
        <el-divider/>
        <el-tree-v2
          v-loading="loading"
          node-key="name"
          :data="idPList"
          :highlight-current="true"
          :current-node-key="activeIdP?.name"
          :props="treeProps"
          @node-click="handleItemChange"
        >
          <template #default="{ node, data }">
            <div>
              <div>
                <el-icon class="p-2" size="15">
                  <component :is="IdpMap[data.provider?.type]"/>
                </el-icon>
              </div>
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
                    <el-dropdown-item :disabled="data.type==='system'"
                                      @click.stop="deleteVisible=true; activeIdP=data;">
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
            New provider
          </el-button>
        </div>
      </el-card>
    </el-col>
    <el-col :span="20">
      <el-row>
        <el-col>
          <el-card shadow="never">
            <el-row>
              <el-col :span="12">{{ activeIdP.name }}</el-col>
              <el-col :span="12" style="text-align: right">
                <el-button type="primary" @click="editVisible = true; editForm = activeIdP">Edit
                </el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col>
          <el-card shadow="never">
            <IdPInfo v-model="activeIdP"/>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
  <CreateProvider v-model:visible="drawerVisible" @change="onChangeProvider" @close="drawerVisible = false"/>
  <EditProvider @conform="editProvider"
                @cancel="editVisible = false"
                @close="editVisible = false"
                v-model="editForm"
                v-model:visible="editVisible"/>
  <el-dialog
    v-model="deleteVisible"
    :title="`Delete '${activeIdP?.name}?'`"
    width="500"
  >
    <span>Are you sure you want to delete <span class="font-bold">{{ activeIdP?.name }}</span>?</span>
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

import {onMounted, ref} from "vue";
import {Connection, Folder, More} from "@element-plus/icons-vue";
import {deleteIdentityProvider, getIdentityProviders, updateIdentityProvider} from "~/api/identity-providers";
import IdPInfo from "~/views/idps/IdPInfo.vue";
import {DbsMap, IdentifyProvider, IdpMap} from "~/types";
import CreateProvider from "~/views/idps/CreateProvider.vue";
import EditProvider from "~/views/idps/EditProvider.vue";

const treeProps = {
  value: 'name',
  children: 'children',
  label: 'name',
}

const drawerVisible = ref<boolean>(false);
const editVisible = ref<boolean>(false);
const deleteVisible = ref<boolean>(false);
const idPList = ref<any[]>([]);
const activeIdP = ref<any>({});
const loading = ref<boolean>(false);
const editForm = ref<any>({});

const reqIdPList = async () => {
  try {
    loading.value = true;
    idPList.value = await getIdentityProviders();
    loading.value = false;
    activeIdP.value = idPList?.value[0];
  } catch (error) {
    ElMessage.error(error as Error);
  }
};
const onChangeProvider = () => {
  reqIdPList();
}
const editProvider = async () => {
  await updateIdentityProvider(editForm.value.name, editForm.value);
  editVisible.value = false
}
const handleItemChange = (item: IdentifyProvider) => {
  activeIdP.value = item;
}
const handleDelete = async () => {
  await deleteIdentityProvider(activeIdP.value?.name);
  await reqIdPList();
  deleteVisible.value = false;
}

onMounted(() => {
  reqIdPList();
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
