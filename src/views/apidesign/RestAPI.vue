<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span>Rest API generator</span>
      </div>
    </template>
    <el-row>
      <el-col :span="6">
        <el-card shadow="never">
          <SelectModel datasource="system" @change="handleItemChange"/>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-scrollbar height="500px">
          <el-form
            label-position="right"
            label-width="150px"
          >
            <el-form-item label="API model">
              {{ activeDs }}.{{ activeModel.name }}
            </el-form-item>
            <el-form-item label="API folder">
              <el-input/>
            </el-form-item>
            <el-form-item label="Generate APIs">
              <el-checkbox-group v-model="apiCheckList">
                <el-checkbox label="List/Search" value="list"/>
                <el-checkbox label="View" value="view"/>
                <el-checkbox label="Create" value="create"/>
                <el-checkbox label="Update" value="update"/>
                <el-checkbox label="Delete" value="delete"/>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <el-tabs type="card" class="pl-6" model-value="list">
            <el-tab-pane label="List/Search" name="list">
              <el-form label-position="right" label-width="150px">
                <el-form-item label="API name">
                  <el-input/>
                </el-form-item>
                <el-form-item label="API path">
                  <el-input/>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="View" name="view">
              <el-form label-position="right" label-width="150px">
                <el-form-item label="API name">
                  <el-input/>
                </el-form-item>
                <el-form-item label="API path">
                  <el-input/>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="Create" name="create">
              <el-form label-position="right" label-width="150px">
                <el-form-item label="API name">
                  <el-input/>
                </el-form-item>
                <el-form-item label="API path">
                  <el-input/>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="Update" name="update">
              <el-form label-position="right" label-width="150px">
                <el-form-item label="API name">
                  <el-input/>
                </el-form-item>
                <el-form-item label="API path">
                  <el-input/>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="Delete" name="delete">
              <el-form label-position="right" label-width="150px">
                <el-form-item label="API name">
                  <el-input/>
                </el-form-item>
                <el-form-item label="API path">
                  <el-input/>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-scrollbar>
      </el-col>
    </el-row>

    <template #footer>
      <div class="text-center">
        <el-button @click="resetForm(formRef)">Cancel</el-button>
        <el-button type="primary" @click="submitForm(formRef)">
          Create
        </el-button>
      </div>
    </template>
  </el-card>
</template>
<script setup lang="ts">

import SelectModel from "~/components/SelectModel.vue";
import {reactive, ref} from "vue";

const activeDs = ref<string>();
const activeModel = ref<any>({});
const apiCheckList = ref<string[]>(['list']);
const form = reactive<{ apiFolder: '' }>();
const handleItemChange = (ds: string, item: any) => {
  activeDs.value = ds;
  activeModel.value = item;
}
</script>
<style scoped>

</style>
