import Menu from '@/renderer/views/components/menu';
import { windowShow } from '@/renderer/common/window';
import style from './style';

export default class Welcome implements View {
  menu = new Menu();

  onReady() {
    windowShow();
  }

  render() {
    return <div class={style}>{this.menu.render()}</div>;
  }
}
