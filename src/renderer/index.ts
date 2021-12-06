import { createApp } from 'vue';
import customize from '@/renderer/store/customize';
import { windowLoad } from '@/renderer/common/window';
import { domPropertyLoad } from '@/renderer/common/dom';
import App from '@/renderer/views/App.vue';
import router from '@/renderer/router';

windowLoad((_, args) => {
  router.addRoute({
    path: '/',
    redirect: args.route
  });
  customize.set(args);
  domPropertyLoad();
  createApp(App).use(router).mount('#app');
});
