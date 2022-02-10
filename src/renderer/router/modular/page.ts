import home from '@/renderer/views/pages/home';
import welcome from '@/renderer/views/pages/welcome';

const Router: Route[] = [
  {
    path: '/welcome',
    component: welcome
  },
  {
    path: '/home',
    component: home
  },
  {
    path: '/about',
    component: () => import('@/renderer/views/pages/about')
  }
];

export default Router;
