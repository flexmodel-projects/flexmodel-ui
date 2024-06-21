<template>
  <el-card shadow="never" style="height: 660px;">
    <template #header>
      <span>Rest API generator</span>
    </template>
    <el-row>
      <el-col :span="6">
        <el-card shadow="never">
          <SelectModel datasource="system" height="280px" @change="handleItemChange"/>
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
                <el-form-item label="Name" prop="name" required>
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
                <el-form-item v-if="form.apis[item].auth" required label="Identifier Provider"
                              prop="identityProvider">
                  <el-select v-model="form.apis[item].identityProvider">
                    <el-option
                      v-for="item in idPs"
                      :key="item.name"
                      :value="item.name"
                      :label="item.name"
                    />
                  </el-select>
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
          Create
        </el-button>
      </div>
    </template>
  </el-card>
</template>
<script setup lang="ts">
import SelectModel from "~/components/SelectModel.vue";
import {onMounted, ref, watch, watchEffect} from "vue";
import {BASE_URI} from "~/api/base";
import {createApi} from "~/api/api-info";
import {getIdentityProviders} from "~/api/identity-providers";

interface RestAPIForm {
  apiFolder: string,
  apis: any,
}

const emits = defineEmits(['submit', 'cancel']);

const apiCheckOptions: { label: string, value: string }[] = [
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

const activeDs = ref<string>();
const activeModel = ref<any>({});
const activeTab = ref<string>('list');
const form = ref<RestAPIForm>({});
const apiCheckList = ref<string[]>(['list']);
const idPs = ref<any[]>([]);

const handleItemChange = (ds: string, item: any) => {
  activeDs.value = ds;
  activeModel.value = item;
}
const submitForm = async () => {
  const {id: parentId} = await createApi({
    name: form.value.apiFolder,
    type: 'FOLDER',
  });
  const keys = Object.keys(form.value.apis);
  for (const key of keys) {
    const api = form.value.apis[key];
    if (api.enable) {
      const meta: any = {
        auth: api.auth,
        identityProvider: api.identityProvider,
        enable: api.enable,
        type: api.type,
        datasource: activeDs.value,
        model: activeModel.value
      };
      if (key === 'list') {
        meta.paging = form.value.apis[key].paging;
      }
      await createApi({
        parentId: parentId,
        name: api.name,
        method: api.method,
        path: api.path,
        type: 'REST_API',
        meta: meta
      });
    }
  }
  emits('submit', form);
}
const handleCancel = () => {
  emits('cancel');
}

const reqIdentityProvider = async () => {
  idPs.value = await getIdentityProviders();
  form.apis[item].identityProvider = idPs?.value[0];
}

watchEffect(() => {
  if (activeModel.value) {
    form.value = {
      apiFolder: `${activeModel.value.name}'s folder`,
      apis: {
        list: {
          type: "list",
          name: `Fetch a paginated ${activeModel.value.name} records list`,
          path: `/${activeDs.value}_${activeModel.value.name}`,
          method: 'GET',
          auth: true,
          paging: true,
          enable: true,
        },
        view: {
          type: "view",
          name: `Fetch a single ${activeModel.value.name} record`,
          path: `/${activeDs.value}_${activeModel.value.name}/{id}`,
          method: 'GET',
          auth: true,
          enable: false,
        },
        create: {
          type: "create",
          name: `Create a single ${activeModel.value.name} record`,
          path: `/${activeDs.value}_${activeModel.value.name}`,
          method: 'POST',
          auth: true,
          enable: false,
        },
        update: {
          type: "update",
          name: `Update a single ${activeModel.value.name} record`,
          path: `/${activeDs.value}/${activeModel.value.name}/{id}`,
          method: 'PUT',
          auth: true,
          enable: false,
        },
        delete: {
          type: "delete",
          name: `Delete a single ${activeModel.value.name} record`,
          path: `/${activeDs.value}/${activeModel.value.name}/{id}`,
          method: 'DELETE',
          auth: true,
          enable: false,
        },
      },
    }
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
      form.value.apis[option.value].enable = apiCheckList.value.includes(option.value)
    })
  }
)
onMounted(() => {
  reqIdentityProvider();
})
</script>
<style scoped>

</style>
