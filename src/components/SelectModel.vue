<template>
  <div>
    <el-select v-model="activeDs" placeholder="Data source" style="width: calc(100% - 50px);">
      <el-option
        v-for="item in dsList"
        :key="item.name"
        :value="item.name">
        <template #default>
          <el-icon class="p-1">
            <component :is="DbsMap[item.config?.dbKind]"/>
          </el-icon>
          {{ item.name }}
        </template>
      </el-option>
      <template #footer>
        <el-button @click="router.push('/datasource')" type="primary" :icon="Edit" style="width: 100%" link>
          Management
        </el-button>
      </template>
    </el-select>
    <el-button class="ml-1" :icon="Refresh" @click="refreshDatasource" :loading="loading"/>
  </div>
  <el-divider/>
  <div>
    <el-input
      style="width: 100%"
      placeholder="Search models"
      v-model="searchQuery"
      clearable
    >
    </el-input>
  </div>
  <el-divider/>
  <el-scrollbar :style="{height: props.height||'300px'}">
    <div class="datasource-wrap">
      <el-empty v-if="filteredItems.length===0"/>
      <div
        class="ds-item"
        :class="{ 'ds-item-active': item.name === activeModel?.name }"
        v-for="(item, index) in filteredItems"
        :key="index"
        @click="handleItemChange(item)"
        :title="item.name"
      >
        <el-icon class="p-2">
          <Document/>
        </el-icon>
        {{ item.name }}
        <div class="absolute right-12px">
          <el-dropdown trigger="hover">
            <el-icon class="icon-hover invisible" @click.stop>
              <More/>
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.stop="deleteDialogVisible=true; activeModel=item;">
                  <span class="text-#f56c6c">Delete</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </el-scrollbar>
  <el-dialog
    v-model="deleteDialogVisible"
    :title="`Delete '${activeModel?.name}?'`"
    width="500"
  >
    <span>Are you sure you want to delete <span class="font-bold">{{ activeModel?.name }}</span>?</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">Cancel</el-button>
        <el-button type="danger" @click="handleDelete">
          Delete
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">

import {Datasource, DbsMap} from "~/types";
import {Document, Edit, More, Refresh} from "@element-plus/icons-vue";
import {computed, onMounted, ref, watchEffect} from "vue";
import {getDatasourceList, refreshDatasource as reqRefreshDatasource} from "~/api/datasource";
import {useRouter} from "vue-router";
import {dropModel, getModelList} from "~/api/model";


const props = defineProps(['datasource', 'height', 'editable']);
const emits = defineEmits(['change']);

const router = useRouter()
const activeDs = ref<string>(props.datasource);
const activeModel = ref<any>({});
const dsList = ref<Datasource[]>([]);
const modelList = ref<any[]>([]);
const loading = ref<boolean>(false);
const deleteDialogVisible = ref<boolean>(false);
const reqDatasourceList = async () => {
  const res = await getDatasourceList();
  dsList.value = res;
  activeDs.value = props.datasource || res[0].name;
};
const reqModelList = async () => {
  const res: any = await getModelList(activeDs.value);
  modelList.value = res;
  activeModel.value = res[0];
  emits('change', activeDs.value, res[0]);
};

const searchQuery = ref<string>();
const filteredItems = computed(() => {
  if (!searchQuery.value) {
    return modelList.value;
  }
  return modelList.value.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value?.toLowerCase())
  );
});
const handleItemChange = (item: any) => {
  activeModel.value = item;
  emits('change', activeDs.value, item);
}

const refreshDatasource = async () => {
  loading.value = true;
  modelList.value = await reqRefreshDatasource(activeDs.value);
  loading.value = false;
}
const handleDelete = async () => {
  await dropModel(activeDs.value, activeModel.value.name);
  await reqModelList();
  deleteDialogVisible.value = false;
}
defineExpose({
  reload: () => {
    reqModelList();
  }
});
onMounted(() => {
  reqDatasourceList();
});
watchEffect(() => {
  if (activeDs.value) {
    reqModelList();
  }
});
</script>
<style scoped lang="scss">
.datasource-wrap {
  position: relative;
  padding: 5px;

  .ds-item {
    font-size: var(--ep-font-size-base);
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    padding: 0 4px;

    &:hover {
      background-color: var(--ep-fill-color-light);

      .icon-hover {
        visibility: visible;
        top: 10px;
      }

    }

    &-active {
      background-color: var(--ep-fill-color-light);
    }
  }
}
</style>
