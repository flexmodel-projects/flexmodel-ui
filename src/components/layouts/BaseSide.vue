<template>
  <el-menu
    :collapse="isCollapse"
    :default-active="onRoutes"
    @open="handleOpen"
    @close="handleClose"
    router
  >
    <template v-for="item in items">
      <template v-if="item.subs">
        <el-sub-menu :index="item.index" :key="item.index">
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.title }}</span>
          </template>
          <template v-for="subItem in item.subs">
            <el-sub-menu
              v-if="subItem.subs"
              :index="subItem.index"
              :key="subItem.index"
            >
              <template #title>
                <el-icon>
                  <component :is="subItem.icon"></component>
                </el-icon>
                {{ subItem.title }}
              </template>
              <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                <el-icon>
                  <component :is="threeItem.icon"></component>
                </el-icon>
                {{ threeItem.title }}
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="subItem.index">
              <el-icon>
                <component :is="subItem.icon"></component>
              </el-icon>
              {{ subItem.title }}
            </el-menu-item>
          </template>
        </el-sub-menu>
      </template>
      <template v-else>
        <el-menu-item :index="item.index" :key="item.index">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <template #title>{{ item?.title }}</template>
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import {DataAnalysis, Document, Files, Refrigerator, Setting} from "@element-plus/icons-vue";
import {useRoute} from "vue-router";

const isCollapse = ref(false);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
export type MenuItem = {
  icon?: any
  size?: number
  title: string
  index: string
  subs?: MenuItem[]
}

const items: MenuItem[] = [
  {
    title: '接口',
    icon: Document,
    index: '1',
    subs: [
      {
        icon: Refrigerator,
        title: '接口设计',
        index: '/helloworld',
      },
      {
        icon: Document,
        title: '接口文档',
        index: '/helloworld',
      },
      {
        icon: DataAnalysis,
        title: '接口日志',
        index: '/logs',
      }
    ]
  },
  {
    title: '数据',
    icon: Document,
    index: '2',
    subs: [
      {
        icon: Refrigerator,
        title: '数据源',
        index: '/datasource',
      },
      {
        icon: Files,
        title: '建模',
        index: '/modeling',
      },
    ]
  },
  {
    icon: Setting,
    title: '设置',
    index: '/helloworld',
  }
]

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});
</script>
