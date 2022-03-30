import { windowShow } from '@/renderer/common/window';
import Menu from '@/renderer/views/components/menu';
import Audio from '@/renderer/views/components/audio';
import contentR from '@/renderer/views/components/content';
import { infoStyle } from './style';

export default class Welcome {
  menu = new Menu();
  audio = new Audio();

  onUnmounted() {
    this.audio.un();
  }

  onReady() {
    windowShow();
  }

  render() {
    return (
      <div class={infoStyle}>
        <div class="left">{this.menu.render()}</div>
        <div class="right">
          <div class="head"></div>
          {contentR.render()}
          <div class="audio">{this.audio.render()}</div>
        </div>
      </div>
    );
  }
}
