import { createRouter, createWebHashHistory } from 'vue-router';
import { argsData } from '@/renderer/store';
import { windowUpdate } from '@/renderer/utils/window';

const Router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: () => import('../views/pages/Welcome.vue')
    },
    {
      path: '/main',
      name: 'Main',
      redirect: '/main/home',
      component: () => import('../views/pages/Main.vue'),
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('../views/pages/Home.vue')
        },
        {
          path: 'search',
          name: 'Search',
          component: () => import('../views/pages/SearchDetails.vue')
        },
        {
          path: 'sheet',
          name: 'Sheet',
          component: () => import('../views/pages/SheetDetails.vue')
        },
        {
          path: 'setting',
          name: 'setting',
          component: () => import('../views/pages/Setting.vue')
        }
      ]
    },
    {
      path: '/sheetCreate',
      name: 'SheetCreate',
      component: () => import('../views/dialogs/SheetCreate.vue')
    }
  ]
});

Router.beforeEach((to, from) => {
  if (to.path !== argsData.window.route) {
    //更新窗口路由
    argsData.window.route = to.path;
    windowUpdate();
  }
});

export default Router;