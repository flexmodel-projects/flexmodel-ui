<template>
  <el-drawer v-model="drawer" title="Create model" size="50%">
    <el-form label-position="top" :model="form">
      <el-form-item label="Name" required>
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="Comment">
        <el-input v-model="form.comment"/>
      </el-form-item>
      <el-form-item label="Fields">
        <el-table :data="form.fields" style="width: 100%">
          <el-table-column label="name" prop="name"/>
          <el-table-column label="type" prop="type"/>
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
        <el-button class="mt-4" style="width: 100%" @click="changeIndexDialogVisible = true">
          Add field
        </el-button>
      </el-form-item>
      <el-form-item label="Indexes">
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
        <el-button class="mt-4" style="width: 100%" @click="changeIndexDialogVisible = true">
          Add index
        </el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawer = false">Cancel</el-button>
      <el-button type="primary">Create</el-button>
    </template>
  </el-drawer>
  <ChangeField v-model="changeFieldDialogVisible"/>
  <ChangeIndex v-model="changeIndexDialogVisible"/>
</template>
<script setup lang="ts">
import {ref, watchEffect} from "vue";
import ChangeField from "~/views/modeling/ChangeField.vue";
import ChangeIndex from "~/views/modeling/ChangeIndex.vue";

const props = defineProps(['modelValue', 'datasource']);
const emits = defineEmits(['update:modelValue']);

const drawer = ref(false);
const changeFieldDialogVisible = ref<boolean>(false);
const changeIndexDialogVisible = ref<boolean>(false);
watchEffect(() => {
  if (props.modelValue) {
    drawer.value = props.modelValue;
  }
});
watchEffect(() => {
  if (drawer) {
    emits('update:modelValue', drawer);
  }
});
const form = ref<any>({});

</script>
<style scoped>

</style>
