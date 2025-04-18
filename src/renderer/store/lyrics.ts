import { MusicType, SongLyrics } from '@/types/music';
import { createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';
import { song_lyric } from '../common/music';

// 本地歌单
export const [lyrics_data, set_lyrics] = createStore<SongLyrics>({ key: '', original: [] });

// 是否有歌词
export const hasLyrics = createMemo(
  () => !!lyrics_data.original && lyrics_data.original.length > 0
);

export const getLyrics = async (type: MusicType, id: string | number) => {
  const key = `${type}_${id}`;
  if (hasLyrics() && lyrics_data.key === key) return;
  const loaclData = localStorage.getItem(`${key}_lyric`);
  if (loaclData) {
    const data = JSON.parse(loaclData) as SongLyrics;
    if (lyrics_data.key === key) {
      set_lyrics(data);
      return;
    }
  }
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
    const lyricData = { key: `${type}_${id}`, original: data };
    localStorage.setItem(`${key}_lyric`, JSON.stringify(lyricData));
    set_lyrics(lyricData);
  }
};
