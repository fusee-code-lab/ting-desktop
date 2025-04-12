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
import { dragStyle, nodragStyle } from '../styles';

injectGlobal`
  html,body { 
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
`;

const style = css`
  color: #fff;
  font-size: 22px;
  padding: 10px;
  pointer-events: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    pointer-events: auto;
  }
`;

// 本地歌单
const [lyrics_data, set_lyrics] = createStore<SongLyrics>({ key: '', original: [] });
const [cur_lyric_idx, set_cur_lyric_idx] = createSignal(0);

// 是否有歌词
const hasLyrics = createMemo(() => !!lyrics_data.original && lyrics_data.original.length > 0);

const getLyrics = async (type: MusicType, id: string | number) => {
  if (hasLyrics() && lyrics_data.key === `${type}_${id}`) return;
  const lyricsData = await song_lyric(type, id);
  if (lyricsData && lyricsData.lyric) {
    const data = lyricsData.lyric.map((item: [string, string]) => ({
      content: item[1],
      time: item[0],
      ms: (() => {
        const timeStr = item[0];
        const minute = parseInt(timeStr.substring(0, 2));
        const second = parseInt(timeStr.substring(3, 5));
        const ms = parseInt(timeStr.split('.')[1]);
        return minute * 60 * 1000 + second * 1000 + ms;
      })()
    }));
    set_lyrics({ key: `${type}_${id}`, original: data });
  }
};

windowMessageOn('audio_song', (data) => {
  data && getLyrics(data.source_type, data.song_id);
});

windowSingleDataOn<SongItem>((data) => {
  data && getLyrics(data.source_type, data.song_id);
});

window.onstorage = (e) => {
  if (e.key === 'audio_time') {
    const ms = Number(e.newValue) * 1000;
    const lyricIdx = lyrics_data.original.findIndex(
      (item, idx) => item.ms <= ms && ms <= (lyrics_data.original[idx + 1]?.ms ?? Infinity)
    );
    set_cur_lyric_idx(lyricIdx);
  }
};

window.onmousemove = (event) => {
  let flag = event.target === document.documentElement;
  console.log(event.target, document.documentElement);

  if (flag) {
    windowIgnoreMouseEvents(true, true);
  } else {
    windowIgnoreMouseEvents(false);
  }
};

export default () => {
  onMount(() => {
    windowShow();
    window.customize.data &&
      getLyrics(window.customize.data.source_type, window.customize.data.song_id);
  });

  const text = createMemo(() => {
    const lyric = lyrics_data.original[cur_lyric_idx()];
    return lyric ? lyric.content : '';
  });

  return (
    <div class={cx(style, dragStyle)}>
      <div class={nodragStyle}>{text()}</div>
    </div>
  );
};
