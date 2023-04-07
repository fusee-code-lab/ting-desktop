import { createRouter, createWebHashHistory } from 'vue-router';
import { windowUpdate } from '@youliso/electronic/ipc';

import pageRoute from '@/renderer/router/modular/page';
import dialogRoute from '@/renderer/router/modular/dialog';

const Router = createRouter({
  history: createWebHashHistory(),
  routes: [...pageRoute, ...dialogRoute]
});

Router.beforeEach((to, from) => {
  if (to.path !== window.customize.route) {
    //更新窗口路由
    window.customize.route = to.path;
    windowUpdate(to.path);
  }
});

export default Router;
