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
          <el-button type="primary" :icon="Plus" plain/>
        </div>
        <el-divider/>
        <el-scrollbar style="height: 360px;">
          <div>
            <el-tree
              ref="treeRef"
              style="max-width: 600px"
              :data="data"
              :props="defaultProps"
              @node-click="handleNodeClick"
              :filter-node-method="filterNode"
            >
              <template #default="{ node, data }">
                <span>{{ node.label }}</span>
              </template>
            </el-tree>
          </div>
        </el-scrollbar>
      </el-card>
    </el-col>
    <el-col :span="20">
      222222
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import {ref, watch} from "vue";
import {MoreFilled, Plus} from "@element-plus/icons-vue";

const treeRef = ref<InstanceType<any>>()

const filterText = ref<string>();
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

interface Tree {
  label: string
  children?: Tree[]
}

const handleNodeClick = (data: Tree) => {
  console.log(data)
}

const data: Tree[] = [
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
      },
    ],
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
      },
      {
        label: 'Level two 2-2',
      },
    ],
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
      },
      {
        label: 'Level two 3-2',
      },
    ],
  },
]
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}
const defaultProps = {
  children: 'children',
  label: 'label',
}
</script>
<style scoped lang="scss">

</style>
