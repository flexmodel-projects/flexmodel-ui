<template>
  <el-row>
    <el-col :span="4">
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
        <el-scrollbar style="height: 360px;">
          <div>
            <el-tree
              ref="treeRef"
              :data="data"
              :props="defaultProps"
              @node-click="handleNodeClick"
              :filter-node-method="filterNode"
            >
              <template #default="{ node, data }">
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
                <div v-if="data.type=='REST_API'" flex>
                  <div class="tree-item-icon">
                    <span v-if="data.method=='GET'" style="color: green;">&nbsp;&nbsp;GET</span>
                    <span v-else-if="data.method=='POST'" style="color: goldenrod;">POST</span>
                    <span v-else-if="data.method=='PUT'" style="color: blue;">&nbsp;&nbsp;PUT</span>
                    <span v-else-if="data.method=='DELETE'" style="color: red;">&nbsp;&nbsp;DEL</span>
                    <span v-else>{{ data.method }}</span>
                  </div>
                  <div class="tree-item-content">
                    <span>{{ node.label }}</span>
                  </div>
                </div>
              </template>
            </el-tree>
          </div>
        </el-scrollbar>
      </el-card>
    </el-col>
    <el-col :span="20">
      <RestAPI v-if="viewType==='REST_API'"/>
      <DefaultPage v-else />
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
                class="dev-tag">
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
import {Folder, Plus} from "@element-plus/icons-vue";
import {getApiTree} from "~/api/api-info";
import {Endpoint, Endpoints} from "~/types";
import RestAPI from "~/views/apidesign/RestAPI.vue";
import DefaultPage from "~/views/apidesign/DefaultPage.vue";

const treeRef = ref<InstanceType<any>>()
const viewType = ref<'REST_API' | 'XXX'>('REST_API');
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
  console.log(item);
  viewType.value = item.type;
  dialogVisible.value = false;
}
</script>
<style scoped lang="scss">
.tree-item-icon {
  text-align: right;
  font-weight: bold;
  font-size: 12px;
}

.tree-item-content {
  padding-left: 10px;
}

.dev-tag {
  position: absolute;
  opacity: 0.8;
  font-size: 10px;
}
</style>
