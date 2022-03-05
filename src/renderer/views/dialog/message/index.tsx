import { getCustomize } from '@/renderer/store';
import { windowShow } from '@/renderer/common/window';
import style from './style';

const args = getCustomize();

export default class Message {
  onReady() {
    windowShow();
  }

  render() {
    return <div class={style}>test</div>;
  }
}
