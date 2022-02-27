import Menu from '@/renderer/views/components/menu';
import Audio from '@/renderer/views/components/audio';
import { windowShow } from '@/renderer/common/window';
import { infoStyle } from './style';

export default class Welcome implements View {
  menu = new Menu();
  audio = new Audio();

  onReady() {
    windowShow();
  }

  render() {
    return (
      <div class={infoStyle}>
        <div class="left">{this.menu.render()}</div>
        <div class="right">
          <div class="audio">{this.audio.render()}</div>
        </div>
      </div>
    );
  }
}
