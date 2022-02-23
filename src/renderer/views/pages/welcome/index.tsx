import { windowShow } from '@/renderer/common/window';
import { metaUrl } from '@/utils';
import style from './style';

export default class Welcome implements View {
  onReady() {
    windowShow();
  }

  render() {
    return (
      <div class={style}>
        <div class="main">
          <div class="content">
            <img src={metaUrl('logo.png')} alt="logo" />
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
