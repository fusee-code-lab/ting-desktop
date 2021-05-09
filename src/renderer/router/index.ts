import { createRouter, createWebHashHistory } from 'vue-router';

export default createRouter({
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
