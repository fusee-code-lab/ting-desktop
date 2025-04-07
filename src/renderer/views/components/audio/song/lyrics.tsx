import { css, cx } from '@emotion/css';
import { createEffect, createMemo, createSignal, For, Match, Show, Switch } from 'solid-js';
import { LyricsIcon } from '../../basis/icons';
import { song_lyric } from '@/renderer/common/music';
import { MusicType, SongItem } from '@/types/music';
import { createStore } from 'solid-js/store';
import { audio_index, audio_list_data, audio_status } from '@/renderer/store/audio';
import { scrollYStyle } from '@/renderer/views/styles';

const list_style = css`
  position: fixed;
  left: var(--menu-width);
  right: 0;
  top: 0;
  bottom: var(--audio-height);
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  > .content {
    width: 300px;
    height: 100%;
    background-color: var(--menu-bg-color);
    border-top-left-radius: var(--size-radius-xs);

    > .lyrics-list {
      padding: 33px 20px 250px;
      overflow: auto;
      height: 100%;

      > .lyrics-item {
        > .original {
          font-weight: bold;
          font-size: 22px;
          color: var(--secondary-label);
          transition: color 0.3s ease-in-out;
        }
      }

      > .lyrics-item:hover {
        > .original {
          color: var(--label);
          transition: none;
        }
      }

      > .lyrics-item.current {
        > .original {
          color: var(--label);
        }
      }
    }

    .empty-lyrics-list-label {
      font-size: 25px;
      color: var(--tertiary-label);
    }
  }
`;

const icon_style = css`
  --size: 20px;
  width: var(--size);
  height: var(--size);
  margin-right: 10px;

  &.show > span {
    color: var(--blue-color);
  }

  > span {
    font-size: var(--size);
  }
`;

interface SongLyrics {
  original: {
    content: string;
    time: string;
    ms: number;
  }[];
}

// 本地歌单
export const [lyrics_data, set_lyrics] = createStore<SongLyrics>({ original: [] });

// 是否有歌词
const hasLyrics = createMemo(() => !!lyrics_data.original && lyrics_data.original.length > 0);
// 是否有歌曲播放
const hasSong = createMemo(() => !!audio_list_data[audio_index()]);

const getLyrics = async (type: MusicType, id: string | number) => {
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
    set_lyrics({ original: data });
  }
};

export const SongLyrics = (props: { data: SongItem }) => {
  const [show, set_show] = createSignal(false);
  // 锁定自动歌词滚动
  const [lock_scroll, set_lock_scroll] = createSignal(false);
  // 当前正在播放的索引
  const [cur_lyric_idx, set_cur_lyric_idx] = createSignal(0);

  const show_menu = () => {
    const is_show = show();
    set_show(!is_show);
    if (!is_show) {
      getLyrics(props.data.source_type, props.data.song_id);
    }
  };

  let lyricsListDom: HTMLUListElement | null = null;
  const lyricsListDomHandler = (e?: HTMLUListElement) => {
    e && (lyricsListDom = e);
  };

  // 滚动/跳转到指定索引的歌词
  const seekToLyricWithIdx = (index: number) => {
    if (!!lock_scroll()) return;
    if (cur_lyric_idx() === index) return;
    set_cur_lyric_idx(index);
    // scroll
    if (!!lyricsListDom) {
      const arr = Array.from(lyricsListDom.children).map((i) => i as HTMLElement);
      const currentLyricElement = arr[index];
      if (!!currentLyricElement) {
        const offset = index === 0 ? 0 : currentLyricElement.offsetTop - 53;
        lyricsListDom.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    }
  };

  createEffect(() => {
    const ms = audio_status.ingTime * 1000;
    const lyricIdx = lyrics_data.original.findIndex(
      (item, idx) => item.ms <= ms && ms <= (lyrics_data.original[idx + 1]?.ms ?? Infinity)
    );
    seekToLyricWithIdx(lyricIdx);
  });

  return (
    <>
      <Show when={show()}>
        <div class={list_style} onClick={() => set_show(false)}>
          <div class="content">
            <Switch>
              <Match when={hasLyrics() && hasSong()}>
                <ul class={cx('lyrics-list', scrollYStyle)} ref={lyricsListDomHandler}>
                  <For each={lyrics_data.original}>
                    {(item, idx) => (
                      <li
                        class={cx('lyrics-item', cur_lyric_idx() === idx() && 'current')}
                        onClick={() => seekToLyricWithIdx(idx())}
                      >
                        <p class="original">{item.content}</p>
                      </li>
                    )}
                  </For>
                </ul>
              </Match>
              <Match when={!hasSong()}>
                <span class="empty-lyrics-list-label">没有正在播放的歌曲</span>
              </Match>
              <Match when={!hasLyrics()}>
                <span class="empty-lyrics-list-label">该歌曲没有歌词</span>
              </Match>
            </Switch>
          </div>
        </div>
      </Show>
      <div class={cx(icon_style, show() && 'show')} onClick={show_menu}>
        <LyricsIcon />
      </div>
    </>
  );
};
