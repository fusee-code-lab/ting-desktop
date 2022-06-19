import { windowShow } from 'ym-electron/renderer/window';
import style from './style';

export default class Message {
  onReady() {
    windowShow();
  }

  render() {
    return <div class={style}>test</div>;
  }
}
