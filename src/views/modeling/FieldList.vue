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
              <el-button type="primary" @click="handleNewField">New field</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col>
        <el-card shadow="never">
          <el-table row-key="name" :data="fieldList" style="width: 100%">
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
                <el-popconfirm title="Are you sure to delete this?" @confirm="delField(scope.$index)">
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
                 @conform="addOrEditField"
                 @cancel="changeDialogVisible = false"
                 :datasource="datasource"
                 :current-value="selectedFieldForm"
                 :model="model"
    />
  </div>
</template>
<script setup lang="ts">
import {ref, watchEffect} from "vue";
import ChangeField from "~/views/modeling/ChangeField.vue";
import {displayFieldType} from "~/utils/models";
import {createField, dropField} from "~/api/model";

const props = defineProps(['modelValue', 'datasource', 'model']);
const emits = defineEmits(['update:modelValue']);

const fieldList = ref<any[]>([]);
const changeDialogVisible = ref<boolean>(false);
const selectedFieldIndex = ref<number>(-1);
const selectedFieldForm = ref<any>();

const handleNewField = () => {
  changeDialogVisible.value = true;
  selectedFieldIndex.value = -1;
  selectedFieldForm.value = {};
}
const handleEdit = (index: number) => {
  selectedFieldIndex.value = index;
  selectedFieldForm.value = fieldList.value[index];
  changeDialogVisible.value = true;
}
const addOrEditField = async (item: any) => {
  if (selectedFieldIndex.value === -1) {
    await createField(props.datasource, props.model?.name, item);
    fieldList.value.push(item);
  } else {
    // todo req update field
    fieldList.value[selectedFieldIndex] = item;
  }
  changeDialogVisible.value = false;
}
const delField = async (index: number) => {
  const field: any = fieldList.value[index];
  await dropField(props.datasource, props.model?.name, field.name);
  fieldList.value.splice(index, 1);
}

watchEffect(() => {
  if (props.modelValue) {
    fieldList.value = props.modelValue;
  }
})
watchEffect(() => {
  if (fieldList.value) {
    emits('update:modelValue', fieldList.value);
  }
})
</script>
<style scoped>

</style>
