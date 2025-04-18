import {
  windowClose,
  windowHide,
  windowIgnoreMouseEvents,
  windowMessageOn,
  windowShow,
  windowSingleDataOn
} from '@youliso/electronic/render';
import { createMemo, onMount, createSignal } from 'solid-js';
import { css, cx, injectGlobal } from '@emotion/css';
import { MusicType, SongItem, SongLyrics } from '@/types/music';
import { createStore } from 'solid-js/store';
import { song_lyric } from '@/renderer/common/music';
import { dragStyle } from '../styles';
import { getLyrics, lyrics_data } from '@/renderer/store/lyrics';

injectGlobal`
  html,body { 
  display: flex;
  justify-content: center;
  align-items: center;
}
`;

const style = css`
  position: relative;
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 本地歌单
const [cur_lyric_idx, set_cur_lyric_idx] = createSignal(0);

const setTimeIdx = (time?: string) => {
  const ms = Number(time ?? localStorage.getItem('audio_time')) * 1000;
  const lyricIdx = lyrics_data.original.findIndex(
    (item, idx) => item.ms <= ms && ms <= (lyrics_data.original[idx + 1]?.ms ?? Infinity)
  );
  set_cur_lyric_idx(lyricIdx);
};

windowMessageOn('audio_song', (data) => {
  data && getLyrics(data.source_type, data.song_id);
});

windowSingleDataOn<SongItem>((data) => {
  data && getLyrics(data.source_type, data.song_id);
});

window.onstorage = (e) => {
  if (e.key === 'audio_time') {
    e.newValue && setTimeIdx(e.newValue);
  }
};

window.onmousemove = (event) => {
  let flag = event.target === document.documentElement;
  console.log(flag);
};

export default () => {
  onMount(() => {
    windowShow();
    window.customize.data &&
      getLyrics(window.customize.data.source_type, window.customize.data.song_id).then(() =>
        setTimeIdx()
      );
  });

  const text = createMemo(() => {
    const lyric = lyrics_data.original[cur_lyric_idx()];
    return lyric ? lyric.content : '';
  });

  return (
    <div class={cx(style, dragStyle)}>
      <div>{text()}</div>
    </div>
  );
};
