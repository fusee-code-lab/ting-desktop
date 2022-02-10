import { h } from '@/renderer/common/h';
import { windowShow } from '@/renderer/common/window';
import indexCss from './scss/index.lazy.scss';

export default class Welcome implements View {
  styles = [indexCss];

  onReady() {
    windowShow();
  }

  render() {
    return (
      <div class="info">
        <div class="main">
          <div class="content">
            <img src={require('@/assets/logo.png')} alt="logo" />
            <div class="title">
              欢迎来到
              <span style="margin-left: 10px">Ting</span>
            </div>
            <button class="but">开始</button>
          </div>
        </div>
      </div>
    );
  }
}
