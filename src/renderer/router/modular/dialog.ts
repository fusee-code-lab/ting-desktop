import { RouteRecordRaw } from 'vue-router';

const Route: RouteRecordRaw[] = [
  {
    path: '/sheetCreate',
    name: 'SheetCreate',
    component: () => import('@/renderer/views/dialogs/SheetCreate.vue')
  }
];

export default Route;
