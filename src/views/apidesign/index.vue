<template>
  <el-row>
    <el-col :span="6">
      <el-card shadow="never">
        <div flex>
          <el-input
            class="mr-1"
            style="width: 100%"
            placeholder="Filter keyword"
            v-model="filterText"
            clearable
          >
          </el-input>
          <el-button type="primary" :icon="Plus" @click="dialogVisible = true" plain/>
        </div>
        <el-divider/>
        <el-scrollbar height="520">
          <el-tree
            ref="treeRef"
            :data="data"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
          >
            <template #default="{ node, data }">
              <div class="flex items-center justify-between" @mouseover="node.settingVisible = true" @mouseleave="node.settingVisible = false">
                <div v-if="data.type=='FOLDER'" flex>
                  <div class="tree-item-icon" style="font-size: 16px;">
                    <el-icon>
                      <Folder/>
                    </el-icon>
                  </div>
                  <div class="tree-item-content">
                    <span>{{ node.label }}</span>
                  </div>
                </div>
                <div v-if="data.type=='REST_API'" :title="node.label" class="flex">
                  <RequestMethodTag class="tree-item-icon" :method="data.method"/>
                  <div class="tree-item-content">
                    <span>{{ node.label }}</span>
                  </div>
                </div>
                <div class="absolute right-6px">
                  <el-dropdown trigger="hover" size="small">
                    <el-icon :class="[!!node.settingVisible ? '' : 'invisible']" @click.stop><More /></el-icon>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click.stop="showCateAdd(data)">Rename</el-dropdown-item>
                        <el-dropdown-item @click.stop="del(data.id)">
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
    v-model="dialogVisible"
    width="600"
    :before-close="handleClose"
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
</template>
<script setup lang="ts">
import {ref, watch} from "vue";
import {Folder, Plus, More} from "@element-plus/icons-vue";
import {getApiTree} from "~/api/api-info";
import {Endpoint, Endpoints} from "~/types";
import RestAPI from "~/views/apidesign/RestAPI.vue";
import DefaultPage from "~/views/apidesign/DefaultPage.vue";
import RequestMethodTag from "~/components/RequestMethodTag.vue";

const treeRef = ref<InstanceType<any>>()
const viewType = ref<'REST_API' | 'DEFAULT_PAGE'>('DEFAULT_PAGE');
const filterText = ref<string>();
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

interface Tree {
  name: string
  children?: Tree[]
}

const handleNodeClick = (data: Tree) => {
  console.log(data)
}
const data = ref<Tree[]>([]);
const reqApiList = async () => {
  data.value = await getApiTree();
}
reqApiList();
const dialogVisible = ref<boolean>(false);

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}
const defaultProps = {
  children: 'children',
  label: 'name',
}
const toApiDesign = (item: Endpoint) => {
  if (!item.enable) {
    ElMessage.warning("Not available");
    return;
  }
  viewType.value = item.type;
  dialogVisible.value = false;
}
const toDefault = () => {
  viewType.value = 'DEFAULT_PAGE';
  dialogVisible.value = false;
  reqApiList();
}
</script>
<style scoped lang="scss">
.tree-item-icon {
  font-size: 10px;
}

.tree-item-content {
  padding-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 190px;
  font-size: 12px;
}

.dev-tag {
  position: absolute;
  opacity: 0.8;
  font-size: 10px;
}
</style>
