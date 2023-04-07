import { createApp } from 'vue';
import { windowLoad } from '@youliso/electronic/ipc';
import App from '@/renderer/views/App.vue';
import router from '@/renderer/router';

windowLoad((_, args) => {
  console.log(args)
  router.addRoute({
    path: '/',
    redirect: args.route!
  });
  window.customize = args;
  document.body.setAttribute('platform', window.environment.platform);
  createApp(App).use(router).mount('#app');
});
