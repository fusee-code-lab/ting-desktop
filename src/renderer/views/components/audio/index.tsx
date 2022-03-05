import audio from '@/renderer/common/audio';

import style from './style';

export default class Audio {
  onTimeUpdate() {
    console.log(audio.ingTime);
  }

  init() {
    addEventListener('audioTimeUpdate', this.onTimeUpdate);
    audio.setSrc(
      'https://img-qn.51miz.com/preview/sound/00/23/00/51miz-S230038-F96C71EB-thumb.mp3'
    );
    audio.loop(true);
  }

  un() {
    removeEventListener('audioTimeUpdate', this.onTimeUpdate);
  }

  test() {
    const pp = () => {
      if (audio.type) {
        el.textContent = '播放';
        audio.pause();
      } else {
        el.textContent = '暂停';
        audio.play();
      }
    };
    const el = (
      <button class="test" onClick={pp}>
        播放
      </button>
    );
    return el;
  }

  render() {
    return <div class={style}>{this.test()}</div>;
  }
}
