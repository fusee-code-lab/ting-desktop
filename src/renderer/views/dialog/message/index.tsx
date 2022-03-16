import { windowShow } from '@/renderer/common/window';
import style from './style';

export default class Message {
  onReady() {
    windowShow();
  }

  render() {
    return <div class={style}>test</div>;
  }
}
