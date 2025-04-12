import { css, cx } from '@emotion/css';
import { createEffect, createMemo, createSignal, For, Match, on, Show, Switch } from 'solid-js';
import { LyricsIcon } from '../../basis/icons';
import { song_lyric } from '@/renderer/common/music';
import { MusicType, SongItem } from '@/types/music';
import { createStore, unwrap } from 'solid-js/store';
import { audio, audio_index, audio_list_data, audio_status } from '@/renderer/store/audio';
import { scrollYStyle } from '@/renderer/views/styles';
import { debounce } from '@/renderer/common/utils';
import { createDialogWindow } from '@/renderer/common/dialog';
import { windowClose } from '@youliso/electronic/render';

const list_style = css`
  position: fixed;
  z-index: 2;
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
    background-color: var(--basic-color);
    border-top-left-radius: var(--size-radius-xs);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > .lyrics-list {
      padding: 33px 20px 250px;
      overflow: auto;
      height: 100%;

      > .lyrics-item {
        > .original {
          font-weight: bold;
          font-size: 22px;
          color: var(--secondary-label-color);
          transition: color 0.3s ease-in-out;
        }
      }

      > .lyrics-item:hover {
        > .original {
          color: var(--tertiary-label-color);
          transition: none;
        }
      }

      > .lyrics-item.current {
        > .original {
          color: var(--blue-color);
        }
      }
    }

    .empty-lyrics-list-label {
      font-size: 25px;
      color: var(--tertiary-label-color);
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
  key: string;
  original: {
    content: string;
    time: string;
    ms: number;
  }[];
}

// 本地歌单
export const [lyrics_data, set_lyrics] = createStore<SongLyrics>({ key: '', original: [] });

// 是否有歌词
const hasLyrics = createMemo(() => !!lyrics_data.original && lyrics_data.original.length > 0);
// 是否有歌曲播放
const hasSong = createMemo(() => !!audio_list_data[audio_index()]);

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

export const SongLyrics = (props: { data: SongItem }) => {
  const [show, set_show] = createSignal(false);
  // 锁定自动歌词滚动
  const [lock_scroll, set_lock_scroll] = createSignal(false);
  // 当前正在播放的索引
  const [cur_lyric_idx, set_cur_lyric_idx] = createSignal(0);

  let lyricsListDom: HTMLUListElement | null = null;
  const lyricsListDomHandler = (e?: HTMLUListElement) => {
    e && (lyricsListDom = e);
  };

  // 使用歌词索引跳转播放时间
  const seekAudioTimeWithLyricIdx = (index: number) => {
    const ms = lyrics_data.original[index].ms;
    if (audio_status.type == 0) {
      audio.currentIngTime(ms / 1000);
    } else {
      audio.currentTime(ms / 1000);
    }
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
        const offset =
          index === 0 ? 0 : currentLyricElement.offsetTop - window.innerHeight / 2 + 73;
        lyricsListDom.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    }
  };

  // 滚动到当前播放歌词
  const scrollToCurrentLyric = (time: number) => {
    const ms = time * 1000;
    const lyricIdx = lyrics_data.original.findIndex(
      (item, idx) => item.ms <= ms && ms <= (lyrics_data.original[idx + 1]?.ms ?? Infinity)
    );
    seekToLyricWithIdx(lyricIdx);
  };

  // 当正在滚动时，锁定自动歌词滚动
  const debouncedOnWheelFunc = debounce(() => {
    set_lock_scroll(false);
  }, 1500);

  const onWheel = (_: WheelEvent) => {
    set_lock_scroll(true);
    debouncedOnWheelFunc();
  };

  createEffect(
    on(
      () => audio_status.ingTime,
      (time) => {
        show() && scrollToCurrentLyric(time);
      }
    )
  );

  createEffect(
    on(
      () => props.data,
      (data) => {
        if (data) {
          getLyrics(data.source_type, data.song_id).finally(() =>
            scrollToCurrentLyric(audio_status.ingTime)
          );
        } else {
          set_lyrics({ key: '', original: [] });
        }
      }
    )
  );

  let song_lyrics_win_id: number | undefined;
  const show_menu = async () => {
    const is_show = show();
    set_show(!is_show);
    if (!is_show) {
      song_lyrics_win_id = await createDialogWindow(
        '/song_lyrics',
        { data: unwrap(props.data), position: 'center-bottom', positionPadding: 30 },
        {
          minWidth: 400,
          minHeight: 100,
          width: 450,
          height: 120,
          resizable: true,
          frame: false,
          transparent: true,
          alwaysOnTop: true
        }
      );
      // getLyrics(props.data.source_type, props.data.song_id).finally(() => {
      //   set_lock_scroll(false);
      //   set_cur_lyric_idx(0);
      //   scrollToCurrentLyric(audio_status.ingTime);
      // });
    } else {
      console.log(song_lyrics_win_id);

      song_lyrics_win_id && (await windowClose(song_lyrics_win_id));
      song_lyrics_win_id = undefined;
    }
  };

  return (
    <>
      {/* <Show when={show()}>
        <div class={list_style} onClick={() => set_show(false)}>
          <div class="content" onClick={(e) => e.stopPropagation()}>
            <Switch>
              <Match when={hasLyrics() && hasSong()}>
                <ul class={cx('lyrics-list', scrollYStyle)} ref={lyricsListDomHandler}>
                  <For each={lyrics_data.original}>
                    {(item, idx) => (
                      <li
                        class={cx('lyrics-item', cur_lyric_idx() === idx() && 'current')}
                        onClick={(e) => {
                          e.stopPropagation();
                          seekAudioTimeWithLyricIdx(idx());
                        }}
                        onWheel={onWheel}
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
      </Show> */}
      <div class={cx(icon_style, show() && 'show')} onClick={show_menu}>
        <LyricsIcon />
      </div>
    </>
  );
};
