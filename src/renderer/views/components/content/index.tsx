import { ChildRoute } from '@/renderer/common/router';
import searchDetail from './searchDetail';

export default new ChildRoute(
  {
    searchDetail: new searchDetail()
  },
  'searchDetail',
  <div class="content"></div>
);
