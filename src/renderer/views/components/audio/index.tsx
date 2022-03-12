import audio from '@/renderer/common/audio';
import style from './style';

export default class Audio {
  playPauseBut = (
    <button class="test" onClick={() => this.playPause()}>
      播放
    </button>
  ) as HTMLButtonElement;

  constructor() {
    addEventListener('audio-update', this.onAudioUpdate.bind(this));
    addEventListener('audio-time-update', this.onAudioTimeUpdate.bind(this));
  }

  un() {
    removeEventListener('audio-update', this.onAudioUpdate);
    removeEventListener('audio-time-update', this.onAudioTimeUpdate);
  }

  onAudioUpdate() {
    console.log('onAudioUpdate', audio.type);
    this.playPauseBut.textContent = audio.type === 1 ? '暂停' : '播放';
  }

  onAudioTimeUpdate() {
    console.log(audio.ingTime);
  }

  playPause() {
    if (audio.type) {
      this.playPauseBut.textContent = '播放';
      audio.pause();
    } else {
      this.playPauseBut.textContent = '暂停';
      audio.play();
    }
  }

  render() {
    return <div class={style}>{this.playPauseBut}</div>;
  }
}
