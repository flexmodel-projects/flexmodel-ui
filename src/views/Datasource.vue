<template>
  <div class="content">
    <el-row>
      <el-col :span="4">
        <el-card shadow="never">
          <div class="datasource-wrap">
            <div
              class="ds-item"
              :class="{ 'ds-item-active': item.id === activeDs.id }"
              v-for="(item, index) in dsList"
              :key="index"
              @click="handleItemChange(item)"
            >
              {{ item.name }}
              <el-dropdown trigger="hover">
                <el-icon>
                  <Setting/>
                </el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleEdit">编辑</el-dropdown-item>
                    <el-dropdown-item @click="handleDelete(roleList.find(r => r?.id === activeDs))"><span
                      class="del-btn">删除</span></el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>

          <el-button type="primary" @click="toggleSelection()" style="width: 100%">新增数据源</el-button>
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-row>
          <el-col>
            <el-card>
              <el-row>
                <el-col :span="12">{{ activeDs.name }}</el-col>
                <el-col :span="12" style="text-align: right">
                  <el-button>模型设计</el-button>
                  <el-button type="info">测试连接</el-button>
                  <el-button type="info">编辑</el-button>
                </el-col>
              </el-row>

            </el-card>
          </el-col>
          <el-col>
            <el-card shadow="never">
              <el-descriptions border column="1">
                <el-descriptions-item label="连接名称">{{ activeDs.name }}</el-descriptions-item>
                <el-descriptions-item label="数据库类型">{{ activeDs.type }}</el-descriptions-item>
                <el-descriptions-item label="主机">{{ activeDs.config?.host }}</el-descriptions-item>
                <el-descriptions-item label="端口">{{ activeDs.config?.port }}</el-descriptions-item>
                <el-descriptions-item label="数据库名">{{ activeDs.config?.dbName }}</el-descriptions-item>
                <el-descriptions-item label="用户名">{{ activeDs.config?.username }}</el-descriptions-item>
                <el-descriptions-item label="密码">{{ activeDs.config?.password }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ activeDs.createTime }}</el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
        </el-row>

      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import {ElMessage} from "element-plus";
import {getDatasourceList} from "~/api/datasource";
import {ref} from "vue";
import {Setting,} from "@element-plus/icons-vue";

const dsList = ref<Datasource[]>([]);
const activeDs = ref<Datasource>({});

const reqDatasourceList = async () => {
  try {
    dsList.value = await getDatasourceList();
    activeDs.value = dsList.value[0]
  } catch (error) {
    ElMessage.error(error as Error);
  }
};
const handleItemChange = (item: Datasource) => {
  activeDs.value = item;
}
reqDatasourceList();
</script>
<style scoped lang="scss">
.datasource-wrap {
  position: relative;
  padding: 5px;

  .ds-item {
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    padding: 0 4px;

    &:hover {
      background-color: #f5f7fa;
    }

    &-active {
      background-color: #ecf5ff;
    }
  }
}
</style>
