<template>
  <el-row>
    <el-col>
      <el-card>
        <el-row>
          <el-col :span="12">{{ model?.name }}
            {{ model?.comment }}
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button type="primary" @click="dialogFormVisible = true">New record</el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col>
      <el-card shadow="never">
        <el-table :data="recordList" style="width: 100%">
          <el-table-column v-for="item in model?.fields" :label="item.name" :prop="item.name">
            <template #default="{ row }">
              {{ row[item.name] }}
            </template>
          </el-table-column>
          <el-table-column label="Operation" width="200" fixed="right">
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
  <el-dialog @close="resetForm(formRef)" v-model="dialogFormVisible" title="New record" width="500">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" status-icon>
      <el-form-item v-for="field in model.fields"
                    :label="field.name"
                    :prop="field.name"
                    :required="!field.nullable">
        <el-input v-if="field.type=='id'" v-model="form[field.name]"/>
        <el-input v-else-if="field.type=='string'" :placeholder="field.comment" v-model="form[field.name]"/>
        <el-input v-else-if="field.type=='text'" :placeholder="field.comment" type="textarea"
                  v-model="form[field.name]"/>
        <el-input v-else-if="field.type=='decimal'" :placeholder="field.comment" type="number"
                  v-model="form[field.name]"/>
        <el-input v-else-if="field.type=='int'" :placeholder="field.comment" type="number" v-model="form[field.name]"/>
        <el-input v-else-if="field.type=='bigint'" :placeholder="field.comment" v-model="form[field.name]"/>
        <el-switch v-else-if="field.type=='boolean'" :placeholder="field.comment" v-model="form[field.name]"/>
        <el-date-picker v-else-if="field.type=='date'" :placeholder="field.comment" type="date"
                        v-model="form[field.name]" style="width: 100%;"/>
        <el-date-picker v-else-if="field.type=='datetime'" type="datetime"
                        :placeholder="field.comment" v-model="form[field.name]" style="width: 100%;"/>
        <el-input v-else-if="field.type=='json'" :placeholder="field.comment" type="textarea"
                  v-model="form[field.name]"/>
        <el-input v-else v-model="form[field.name]"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="resetForm(formRef)">Cancel</el-button>
        <el-button type="primary" @click="submitForm(formRef)">
          Create
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import {reactive, ref, watchEffect} from "vue";
import {createRecord, deleteRecord, getRecordList} from "~/api/record";
import type {FormInstance, FormRules} from 'element-plus'

const dialogFormVisible = ref(false);
const editMode = ref<boolean>(false);
const props = defineProps(['datasource', 'model']);
const model = ref<any>();
const recordList = ref<any[]>([]);
const reqRecordList = async () => {
  recordList.value = await getRecordList(props.datasource, props.model?.name);
};
const reqDeleteRecord = async (record: any) => {
  if (!model.value?.idField) {
    ElMessage.warning("Can't delete a record without ID!");
  }
  await deleteRecord(props.datasource, model.value.name, record[model.value?.idField?.name]);
  await reqRecordList();
};
const form = reactive<any>({});
const rules = reactive<FormRules<any>>({});
const formRef = ref<FormInstance>({});
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      await createRecord(props.datasource, model.value.name, form);
      await reqRecordList();
      dialogFormVisible.value = false;
    }
  });
};
const resetForm = (formEl: FormInstance | undefined) => {
  dialogFormVisible.value = false;
  if (!formEl) return;
  formEl.resetFields();
  Object.keys(form).forEach(key => form[key] = '');
  editMode.value = false;
}
const handleEdit = (record: any) => {
  dialogFormVisible.value = true;
  editMode.value = true;
  Object.keys(record).forEach((key: string) => {
      const value = record[key];
      form[key] = value !== null && typeof value === 'object' ? JSON.stringify(value) : value;
    });
};
watchEffect(() => {
  if (props.model) {
    reqRecordList();
    model.value = props.model;
    props.model.fields.forEach((field: any) => {
      rules[field.name] = [
        {
          required: !field.nullable,
          message: `Please input ${field.name}`
        }
      ];
    });
  }
});
</script>
<style scoped>

</style>
