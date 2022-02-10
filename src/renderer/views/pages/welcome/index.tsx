import { h } from '@/renderer/common/h';
import { windowShow } from '@/renderer/common/window';
import indexCss from './scss/index.lazy.scss';

export default class Welcome implements View {
  styles = [indexCss];

  onReady() {
    windowShow();
  }

  render() {
    return <div class="info">music</div>;
  }
}
