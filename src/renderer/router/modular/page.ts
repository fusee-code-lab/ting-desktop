import welcome from '@/renderer/views/pages/welcome';
import index from '@/renderer/views/pages/index';
const Router: Route[] = [
  {
    path: '/welcome',
    component: welcome
  },
  {
    path: '/index',
    component: index
  }
];

export default Router;
