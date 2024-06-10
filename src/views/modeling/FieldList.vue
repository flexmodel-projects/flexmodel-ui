<template>
  <div>
    <el-row>
      <el-col>
        <el-card shadow="never">
          <el-row>
            <el-col :span="12">{{ model?.name }}
              {{ model?.comment }}
            </el-col>
            <el-col :span="12" style="text-align: right">
              <el-button type="primary" @click="newField">New field</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col>
        <el-card shadow="never">
          <el-table :data="model?.fields" style="width: 100%">
            <el-table-column label="name" prop="name"/>
            <el-table-column label="type" prop="type">
              <template #default="{row}">
                {{ displayFieldType(row) }}
              </template>
            </el-table-column>
            <el-table-column label="unique" prop="unique"/>
            <el-table-column label="nullable" prop="nullable"/>
            <el-table-column label="comment" prop="comment"/>
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
    <ChangeField v-model="changeDialogVisible"
                 :visible="changeDialogVisible"
                 @conform="(item)=>{
                 changeDialogVisible = false
                 console.log(item)
               }"
                 @cancel="changeDialogVisible = false"
                 :datasource="datasource"
                 :model="model"
    />
  </div>
</template>
<script setup lang="ts">
import {ref, watchEffect} from "vue";
import ChangeField from "~/views/modeling/ChangeField.vue";
import {displayFieldType} from "~/utils/models";

const props = defineProps(['datasource', 'model']);

const changeDialogVisible = ref<boolean>(false);

const newField = () => {
  changeDialogVisible.value = true;
}

</script>
<style scoped>

</style>
