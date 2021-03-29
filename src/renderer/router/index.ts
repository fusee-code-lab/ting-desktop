import { createRouter, createWebHashHistory } from 'vue-router';

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: () => import(/* webpackChunkName: "welcome" */ '../views/pages/Welcome.vue')
    },
    {
      path: '/main',
      name: 'Main',
      redirect: '/main/home',
      component: () => import(/* webpackChunkName: "main" */ '../views/pages/Main.vue'),
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () =>
            import(/* webpackChunkName: "home" */ '../views/pages/Home.vue')
        },
        {
          path: 'search',
          name: 'Search',
          component: () =>
            import(/* webpackChunkName: "search" */ '../views/pages/SearchDetails.vue')
        }
      ]
    },
    {
      path: '/sheetCreate',
      name: 'SheetCreate',
      component: () =>
        import(/* webpackChunkName: "sheetCreate" */ '../views/dialogs/SheetCreate.vue')
    }
  ]
});
