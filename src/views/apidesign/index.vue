<template>
  <el-row>
    <el-col :span="6">
      <el-card shadow="never">
        <div class="flex">
          <el-input
            class="mr-1"
            style="width: 100%"
            placeholder="Search APIs"
            v-model="filterText"
            clearable
          >
          </el-input>
          <el-button type="primary" :icon="Plus" @click="apiDialogVisible = true" plain/>
        </div>
        <el-divider/>
        <el-scrollbar height="538">
          <el-tree
            v-loading="loading"
            ref="treeRef"
            node-key="id"
            :data="apiList"
            :highlight-current="true"
            :current-node-key="selectedNode?.id"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
          >
            <template #default="{ node, data }">
              <div class="flex items-center justify-between" @mouseover="node.settingVisible = true"
                   @mouseleave="node.settingVisible = false">
                <div v-if="data.type=='FOLDER'" class="flex">
                  <div>
                    <el-icon>
                      <Folder/>
                    </el-icon>
                  </div>
                  <div class="tree-item-content">
                    <span v-if="editNode == data.id">
                      <HoverEditInput @change="editApi" v-model="editForm.name" size="small"/>
                    </span>
                    <span v-else>{{ node.label }}</span>
                  </div>
                </div>
                <div v-if="data.type=='REST_API'" :title="node.label" class="flex">
                  <RequestMethodTag class="text-12px" :method="data.method"/>
                  <div class="tree-item-content">
                    <span v-if="editNode == data.id">
                      <HoverEditInput @change="editApi" v-model="editForm.name" size="small"/>
                    </span>
                    <span v-else>{{ node.label }}</span>
                  </div>
                </div>
                <div class="absolute right-12px">
                  <el-dropdown trigger="hover">
                    <el-icon :class="[!!node.settingVisible ? '' : 'invisible']" @click.stop>
                      <More/>
                    </el-icon>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click.stop="showEditInput(data)">Rename</el-dropdown-item>
                        <el-dropdown-item @click.stop="deleteDialogVisible=true;selectedNode=data">
                          <span class="text-#f56c6c">Delete</span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </template>
          </el-tree>
        </el-scrollbar>
      </el-card>
    </el-col>
    <el-col :span="18">
      <RestAPI @submit="toDefault" @cancel="viewType = 'DEFAULT_PAGE';" v-if="viewType==='REST_API'"/>
      <DefaultPage v-if="viewType==='DEFAULT_PAGE'"/>
    </el-col>
  </el-row>
  <el-dialog
    v-model="apiDialogVisible"
    width="600"
  >
    <el-row :gutter="10" class="p-20px">
      <el-col v-for="(item, index) in Endpoints" :key="index" :span="6" class="mb-10px">
        <el-card class="cursor-pointer hover:border-[--el-color-primary]" shadow="never" @click="toApiDesign(item)">
          <div class="text-[--el-text-color-regular] text-center">
            <div class="text-18px mb-12px flex items-center">
              <el-icon class="w-50px pl-16px" size="50">
                <component :is="item.icon"/>
              </el-icon>
              <el-tag
                v-if="!item.enable"
                type="warning"
                effect="plain"
                size="small"
                class="dev-tag" round>
                Coming soon...
              </el-tag>
            </div>
            <p class="op-80">{{ item.name }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-dialog>
  <el-dialog
    v-model="deleteDialogVisible"
    :title="`Delete '${selectedNode?.name}?'`"
    width="500"
  >
    <span>Are you sure you want to delete <span class="font-bold">{{ selectedNode?.name }}</span>?</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">Cancel</el-button>
        <el-button type="danger" @click="handleDelete">
          Delete
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {Folder, More, Plus} from "@element-plus/icons-vue";
import {deleteApi, getApis, updateApi} from "~/api/api-info";
import {Endpoint, Endpoints} from "~/types";
import RestAPI from "~/views/apidesign/RestAPI.vue";
import DefaultPage from "~/views/apidesign/DefaultPage.vue";
import RequestMethodTag from "~/components/RequestMethodTag.vue";
import HoverEditInput from "~/components/HoverEditInput.vue";

const defaultProps = {
  children: 'children',
  label: 'name',
}

interface Tree {
  name: string
  children?: Tree[]
}

const treeRef = ref<InstanceType<any>>();
const viewType = ref<'REST_API' | 'DEFAULT_PAGE' | string>('DEFAULT_PAGE');
const filterText = ref<string>();
const loading = ref<boolean>(false);
const apiList = ref<Tree[]>([]);
const deleteDialogVisible = ref<boolean>(false);
const apiDialogVisible = ref<boolean>(false);
const selectedNode = ref<Record<string, any> | null>();
const editNode = ref<string>('');
const editForm = reactive<any>({});

const handleNodeClick = (data: Tree) => {
  console.log(data)
}
const reqApiList = async () => {
  loading.value = true;
  apiList.value = await getApis();
  loading.value = false;
}
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}
const toApiDesign = (item: Endpoint) => {
  if (!item.enable) {
    ElMessage.warning("Not available");
    return;
  }
  viewType.value = item.type;
  apiDialogVisible.value = false;
}
const toDefault = () => {
  viewType.value = 'DEFAULT_PAGE';
  apiDialogVisible.value = false;
  reqApiList();
}
const handleDelete = async () => {
  deleteDialogVisible.value = false;
  await deleteApi(selectedNode.value?.id);
  await reqApiList();
}
const showEditInput = (data: any) => {
  Object.assign(editForm, data);
  editNode.value = data.id;
}
const editApi = async () => {
  editNode.value = '';
  await updateApi(editForm.id, editForm);
  await reqApiList();
}

watch(filterText, (val) => {
  treeRef.value!.filter(val)
});
onMounted(() => {
  reqApiList();
});
</script>
<style scoped lang="scss">
.tree-item-content {
  padding-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 190px;
}

.dev-tag {
  position: absolute;
  opacity: 0.8;
  font-size: 10px;
}
</style>
