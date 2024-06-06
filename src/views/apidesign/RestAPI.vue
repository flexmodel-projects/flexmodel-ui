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
            :model="form"
            label-position="right"
            label-width="150px"
          >
            <el-form-item label="API model">
              {{ activeDs }}.{{ activeModel.name }}
            </el-form-item>
            <el-form-item label="API folder" required>
              <el-input v-model="form.apiFolder"/>
            </el-form-item>
            <el-form-item label="Generate APIs">
              <el-checkbox-group min="1" v-model="apiCheckList">
                <el-checkbox v-for="item in apiCheckOptions" :label="item.label" :value="item.value"/>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <el-tabs type="card" class="pl-6" v-model="activeTab">
            <el-tab-pane v-for="item in apiCheckList"
                         :name="item"
                         :label="apiCheckOptions.filter(option=> option.value===item)[0]?.label">
              <el-form label-position="right" :model="form.apis[item]" label-width="150px">
                <el-form-item label="name" prop="name" required>
                  <el-input v-model="form.apis[item].name"/>
                </el-form-item>
                <el-form-item label="URI" prop="path" required>
                  <el-input v-model="form.apis[item].path">
                    <template #prepend>
                      <el-select v-model="form.apis[item].method" style="width: 100px" disabled>
                        <el-option value="GET"/>
                        <el-option value="POST"/>
                        <el-option value="PUT"/>
                        <el-option value="DELETE"/>
                      </el-select>
                    </template>
                    <template #prefix>
                      <div>
                        {{ BASE_URI }}/v1
                      </div>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="Auth" prop="auth">
                  <el-switch v-model="form.apis[item].auth"/>
                </el-form-item>
                <el-form-item label="Paging" prop="paging" v-if="item==='list'">
                  <el-switch v-model="form.apis[item].paging"/>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-scrollbar>
      </el-col>
    </el-row>

    <template #footer>
      <div class="text-center">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" @click="submitForm">
          Submit
        </el-button>
      </div>
    </template>
  </el-card>
</template>
<script setup lang="ts">
import SelectModel from "~/components/SelectModel.vue";
import {reactive, ref, watch, watchEffect} from "vue";
import {BASE_URI} from "~/api/base";
import {createApi} from "~/api/api-info";

const emits = defineEmits(['submit', 'cancel']);

const activeDs = ref<string>();
const activeModel = ref<any>({});
const activeTab = ref<string>('list');
const apiCheckOptions: { label: string, value: string } = [
  {
    value: 'list',
    label: 'List/Search'
  },
  {
    value: 'view',
    label: 'View'
  },
  {
    value: 'create',
    label: 'Create'
  },
  {
    value: 'update',
    label: 'Update'
  },
  {
    value: 'delete',
    label: 'Delete'
  },

];
const apiCheckList = ref<string[]>(['list']);

interface RestAPIForm {
  apiFolder: string,
  apis: {
    type: 'list' | 'view' | 'create' | 'update' | 'delete',
    name: string,
    path: string,
    method: string,
    auth: true,
    paging?: false,
  }[]
}

const form = reactive<RestAPIForm[]>({});
watchEffect(() => {
  if (activeModel.value) {
    Object.assign(form, {
      apiFolder: `${activeModel.value.name}'s folder`,
      apis: {
        list: {
          type: "list",
          name: `Fetch a paginated ${activeModel.value.name} records list`,
          path: `/ds/${activeDs.value}/models/${activeModel.value.name}/records`,
          method: 'GET',
          auth: true,
          paging: true,
          enable: true,
        },
        view: {
          type: "view",
          name: `Fetch a single ${activeModel.value.name} record`,
          path: `/ds/${activeDs.value}/models/${activeModel.value.name}/records/:id`,
          method: 'GET',
          auth: true,
          enable: false,
        },
        create: {
          type: "create",
          name: `Create a single ${activeModel.value.name} record`,
          path: `/ds/${activeDs.value}/models/${activeModel.value.name}/records`,
          method: 'POST',
          auth: true,
          enable: false,
        },
        update: {
          type: "update",
          name: `Update a single ${activeModel.value.name} record`,
          path: `/ds/${activeDs.value}/models/${activeModel.value.name}/records/:id`,
          method: 'PUT',
          auth: true,
          enable: false,
        },
        delete: {
          type: "delete",
          name: `Delete a single ${activeModel.value.name} record`,
          path: `/ds/${activeDs.value}/models/${activeModel.value.name}/records/:id`,
          method: 'DELETE',
          auth: true,
          enable: false,
        },
      },
    });
  }
})
watchEffect(() => {
  if (!apiCheckList.value.includes(activeTab)) {
    activeTab.value = apiCheckList.value[0];
  }
});
watch(
  () => apiCheckList.value,
  () => {
    apiCheckOptions.forEach(option => {
      form.apis[option.value].enable = apiCheckList.value.includes(option.value)
    })
  }
)
const handleItemChange = (ds: string, item: any) => {
  activeDs.value = ds;
  activeModel.value = item;
}
const submitForm = async () => {
  const {id: parentId} = await createApi({
    name: form.apiFolder,
    type: 'FOLDER',
  });
  const keys = Object.keys(form.apis);
  for (const key of keys) {
    const api = form.apis[key];
    if (api.enable) {
      await createApi({
        parentId: parentId,
        name: api.name,
        method: api.method,
        path: api.path,
        type: 'REST_API',
        meta: {...api},
      });
    }
  }
  emits('submit', form);
}
const handleCancel = () => {
  emits('cancel');
}
</script>
<style scoped>

</style>
