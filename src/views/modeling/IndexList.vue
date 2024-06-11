<template>
  <el-row>
    <el-col>
      <el-card shadow="never">
        <el-row>
          <el-col :span="12">{{ model?.name }}
            {{ model?.comment }}
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button type="primary" @click="handleAdd">New index</el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col>
      <el-card shadow="never">
        <el-table :data="indexList" style="width: 100%">
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
              <el-button type="primary" link @click="handleEdit(scope.$index)">
                Edit
              </el-button>
              <el-popconfirm title="Are you sure to delete this?" @confirm="delIndex(scope.$index)">
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
  <ChangeIndex v-model="changeDialogVisible"
               :datasource="datasource"
               :model="model"
               @conform="addOrEditIndex"
               @cancel="changeDialogVisible = false"

  />
</template>
<script setup lang="ts">
import {ref, watchEffect} from "vue";
import ChangeIndex from "~/views/modeling/ChangeIndex.vue";
import {createIndex, dropIndex} from "~/api/model";

const props = defineProps(['modelValue', 'datasource', 'model']);
const emits = defineEmits(['update:modelValue']);
const indexList = ref<any[]>([]);
const changeDialogVisible = ref<boolean>(false);
const selectedIndexKey = ref<number>(-1);
const selectedIndexForm = ref<string>();
const handleAdd = () => {
  changeDialogVisible.value = true;
  selectedIndexKey.value = -1;
  selectedIndexForm.value = {};
}
const handleEdit = (index: number) => {
  selectedIndexKey.value = index;
  selectedIndexForm.value = indexList.value[index];
  changeDialogVisible.value = true;
}
const addOrEditIndex = async (item: any) => {
  if (selectedIndexKey.value == -1) {
    await createIndex(props.datasource, props.model?.name, item);
    indexList.value.push(item);
  } else {
    // todo req update index
    indexList.value[selectedIndexKey] = item;
  }
  changeDialogVisible.value = false;
}
const delIndex = async (key: number) => {
  const index: any = indexList.value[key];
  await dropIndex(props.datasource, props.model?.name, index.name);
  indexList.value.splice(index, 1);
  changeDialogVisible.value = false;

}
watchEffect(() => {
  if (props.modelValue) {
    indexList.value = props.modelValue;
  }
})
watchEffect(() => {
  if (indexList.value) {
    emits('update:modelValue', indexList.value);
  }
})
</script>
<style scoped>

</style>
