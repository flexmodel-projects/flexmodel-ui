<template>
  <el-row>
    <el-col>
      <el-card shadow="never">
        <el-row>
          <el-col :span="12">{{ model?.name }}
            {{ model?.comment }}
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button type="primary" @click="changeDialogVisible = true">New index</el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col>
      <el-card shadow="never">
        <el-table :data="model?.indexes" style="width: 100%">
          <el-table-column label="name" prop="name" width="200"/>
          <el-table-column label="fields" width="auto">
            <template #default="{ row }">
              <div class="flex gap-1">
                <el-tag type="info" v-for="item in row.fields">
                  {{ item?.fieldName }} {{ item.direction }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="unique" prop="unique" width="100"/>
          <el-table-column label="operations" width="150" fixed="right">
            <template #default="scope">
              <el-button type="primary" link @click="handleEdit(scope.row)">
                Edit
              </el-button>
              <el-popconfirm title="Are you sure to delete this?" @confirm="reqDeleteRecord(scope.row)">
                <template #reference>
                  <el-button type="primary" link>
                    Delete
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
  <ChangeField v-model="changeDialogVisible" :datasource="datasource" :model="model"/>
</template>
<script setup lang="ts">
import {ref, watchEffect} from "vue";
import ChangeField from "~/views/modeling/ChangeField.vue";

const props = defineProps(['datasource', 'model']);

const changeDialogVisible = ref<boolean>(false);
</script>
<style scoped>

</style>
