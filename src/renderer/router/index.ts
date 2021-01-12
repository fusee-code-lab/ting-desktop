import {createRouter, createWebHashHistory} from "vue-router";

export default createRouter({
    history: createWebHashHistory(),
    routes: [
      {
        path:'/',
        name:'Welcome',
        component:()=>import('../views/pages/Welcome.vue')
      },
      {
        path: "/home",
        name: "Home",
        component: () => import(/* webpackChunkName: "home" */ "../views/pages/Home.vue")
    }]
});
