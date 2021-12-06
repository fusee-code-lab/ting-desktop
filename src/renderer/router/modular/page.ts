import { RouteRecordRaw } from 'vue-router';

const Route: RouteRecordRaw[] = [
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('@/renderer/views/pages/Welcome.vue')
  },
  {
    path: '/main',
    name: 'Main',
    redirect: '/main/home',
    component: () => import('@/renderer/views/pages/Main.vue'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/renderer/views/pages/Home.vue')
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('@/renderer/views/pages/SearchDetails.vue')
      },
      {
        path: 'sheet',
        name: 'Sheet',
        component: () => import('@/renderer/views/pages/SheetDetails.vue')
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('@/renderer/views/pages/Setting.vue')
      }
    ]
  }
];

export default Route;
