import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";

import Home from "~/views/Home.vue";
import HelloWorld from "~/components/HelloWorld.vue";
import Datasource from "~/components/Datasource.vue";

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home,
    meta: {
      title: '首页'
    },
    children: [
      {
        path: '/helloworld',
        component: HelloWorld,
        meta: {
          title: '你好世界'
        },
      },
      {
        path: '/datasource',
        component: Datasource,
        meta: {
          title: '数据源管理'
        },
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  document.title = `${to.meta.title} | 一站式 API 设计平台`;
  next();
});

export default router;


