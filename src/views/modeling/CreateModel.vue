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
              <el-button type="primary" link @click="handleEditField(scope.$index)">
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
        <el-button class="mt-4" style="width: 100%" @click="handleAddField">
          Add field
        </el-button>
      </el-form-item>
      <el-form-item label="Indexes">
        <el-table :data="form?.indexes" style="width: 100%">
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
              <el-button type="primary" link @click="handleEditIndex(scope.$index)">
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
        <el-button class="mt-4" style="width: 100%" @click="handleAddIndex">
          Add index
        </el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelForm">Cancel</el-button>
      <el-button type="primary" @click="submitForm">Create</el-button>
    </template>
  </el-drawer>
  <ChangeField v-model="changeFieldDialogVisible"
               :visible="changeFieldDialogVisible"
               :datasource="datasourceName"
               :model="form"
               :current-value="fieldForm"
               @conform="addOrEditField"
               @cancel="handleCancelFieldForm"
  />
  <ChangeIndex v-model="changeIndexDialogVisible"
               :datasource="datasourceName"
               :model="form"
               :current-value="indexForm"
               @conform="addOrEditIndex"
               @cancel="changeIndexDialogVisible = false"

  />
</template>
<script setup lang="ts">
import {computed, ref, watchEffect} from "vue";
import ChangeField from "~/views/modeling/ChangeField.vue";
import ChangeIndex from "~/views/modeling/ChangeIndex.vue";
import {displayFieldType} from "~/utils/models";
import {Model} from "~/types";

const props = defineProps(['modelValue', 'datasource']);
const emits = defineEmits(['update:modelValue', 'conform', 'cancel']);

const drawer = ref(false);
const changeFieldDialogVisible = ref<boolean>(false);
const changeIndexDialogVisible = ref<boolean>(false);
const datasourceName = computed(() => props.datasource);

const form = ref<Model>({
  name: '',
  comment: '',
  fields: [
    {
      name: 'id',
      type: 'id',
      unique: true,
      nullable: false,
      generatedValue: 'AUTO_INCREMENT',
      comment: 'ID'
    }
  ],
  indexes: []
});
const fieldForm = ref<any>({});
const selectedFieldKey = ref<number>(-1);
const handleAddField = () => {
  fieldForm.value = {};
  selectedFieldKey.value = -1;
  changeFieldDialogVisible.value = true;
}
const handleEditField = (index: number) => {
  fieldForm.value = form.fields[index];
  selectedFieldKey.value = index;
  changeFieldDialogVisible.value = true;
}
const handleCancelFieldForm = () => {
  fieldForm.value = {};
  changeFieldDialogVisible.value = false
}
const addOrEditField = (val: any) => {
  if (selectedFieldKey.value === -1) {
    form.value.fields.push(val);
  } else {
    form.value.fields[selectedFieldKey.value] = val;
  }
  changeFieldDialogVisible.value = false;
}
const delField = (index: number) => {
  form.value.fields.splice(index, 1);
}


const indexForm = ref<any>({});
const selectedIndexKey = ref<number>(-1);
const handleAddIndex = () => {
  indexForm.value = {};
  selectedIndexKey.value = -1;
  changeIndexDialogVisible.value = true;
}
const handleEditIndex = (index: number) => {
  indexForm.value = form.value.indexes[index];
  selectedIndexKey.value = index;
  changeIndexDialogVisible.value = true;
}


const addOrEditIndex = (val: any) => {
  if (selectedIndexKey.value === -1) {
    form.value.indexes.push(val);
  } else {
    form.value.indexes[selectedIndexKey] = val;
  }
  changeIndexDialogVisible.value = false;
}
const delIndex = (index: number) => {
  form.value.indexes.splice(index, 1);
}

const cancelForm = () => {
  emits('cancel');
}
const submitForm = async () => {
  emits('conform', form);
}

watchEffect(() => {
  if (props.modelValue) {
    drawer.value = props.modelValue;
  }
});
watchEffect(() => {
  if (drawer.value) {
    emits('update:modelValue', drawer);
  }
});
</script>
<style scoped>

</style>
