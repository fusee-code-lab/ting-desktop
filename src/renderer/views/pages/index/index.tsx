import { windowShow } from '@/renderer/common/window';
import Menu from '@/renderer/views/components/menu';
import Audio from '@/renderer/views/components/audio';
import SearchDetail from './components/searchDetail';
import { infoStyle } from './style';

export default class Welcome {
  menu = new Menu();
  audio = new Audio();
  searchDetail = new SearchDetail();

  onUnmounted() {
    this.audio.un();
    this.searchDetail.un();
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
          <div class="content">{this.searchDetail.render()}</div>
          <div class="audio">{this.audio.render()}</div>
        </div>
      </div>
    );
  }
}
