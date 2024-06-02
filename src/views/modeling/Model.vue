<template>
  <el-row>
    <el-col>
      <el-card>
        <el-row>
          <el-col :span="12">{{ model?.name }}
            {{ model?.comment }}
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button type="info">Edit</el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col>
      <el-card shadow="never">
        <el-table :data="model?.fields" style="width: 100%">
          <el-table-column label="Name" prop="name"/>
          <el-table-column label="Type" prop="type"/>
          <el-table-column label="Unique" prop="unique"/>
          <el-table-column label="Nullable" prop="nullable"/>
          <el-table-column label="Comment" prop="comment"/>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import {ref, watchEffect} from "vue";

const props = defineProps(['datasource', 'model']);
const model = ref<any>({});
watchEffect(() => {
  if (props.model) {
    model.value = props.model;
  }
});
</script>
<style scoped>

</style>
