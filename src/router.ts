import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";

import Home from "~/views/Home.vue";
import HelloWorld from "~/components/HelloWorld.vue";
import Datasource from "~/views/datasource/index.vue";
import Modeling from "~/views/modeling/index.vue";

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/modeling',
  },
  {
    path: '/',
    component: Home,
    meta: {
      title: 'Index Page'
    },
    children: [
      {
        path: '/helloworld',
        component: HelloWorld,
        meta: {
          title: 'Hello world'
        },
      },
      {
        path: '/modeling',
        component: Modeling,
        meta: {
          title: 'Modeling'
        },
      },
      {
        path: '/logs',
        component: HelloWorld,
        meta: {
          title: 'Logs'
        },
      },
      {
        path: '/datasource',
        component: Datasource,
        meta: {
          title: 'Data source'
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
  document.title = `${to.meta.title} | All-in-one API design platform`;
  next();
});

export default router;


