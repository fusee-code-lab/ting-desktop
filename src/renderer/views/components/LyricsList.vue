<template>
  <ul v-if='hasLyrics && hasSong' class='lyrics-list' :ref='lyricsListDom'>
    <li
      v-for='(item, idx) in lyrics.original'
      class='lyrics-item'
      :class='{ current: curLyricIdx === idx }'
      :key='idx'
      @click='seekAudioTimeWithLyricIdx(idx)'
      @wheel='onWheel'
    >
      <p class='original'>{{ item.content }}</p>
    </li>
  </ul>
  <div v-else-if='!hasSong' class='empty-lyrics-list'>
    <span class='empty-lyrics-list-label'>没有正在播放的歌曲</span>
  </div>
  <div v-else-if='!hasLyrics' class='empty-lyrics-list'>
    <span class='empty-lyrics-list-label'>该歌曲没有歌词</span>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, reactive, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { audioData } from '@/renderer/core';
import { getLyric } from '@/lib/musicapi/api';
import { audio } from '@/renderer/core/audio';
import { debounce } from '@/lib';
import { WatchStopHandle } from '@vue/runtime-core';

interface SongLyrics {
  original: {
    content: string;
    time: string;
    ms: number;
  }[];
}

export default defineComponent({
  name: 'SidePopup',
  setup() {
    // 锁定自动歌词滚动
    const lockScroll = ref(false);
    // 歌词数据
    const lyrics = reactive<SongLyrics>({ original: [] });
    // 当前正在播放的索引
    const curLyricIdx = ref(0);
    // 歌词列表的 dom 元素
    const lyricsList = ref<HTMLElement | null>(null);
    // 是否有歌词
    const hasLyrics = computed(() => !!lyrics.original && lyrics.original.length > 0);
    // 是否有歌曲播放
    const hasSong = computed(() => !!audioData.songInfo);

    // 获取DMO
    function lyricsListDom(el: HTMLElement) {
      lyricsList.value = el;
    }

    // 使用歌词索引跳转播放时间
    function seekAudioTimeWithLyricIdx(index: number) {
      const ms = lyrics.original[index].ms;
      if (audioData.paused) {
        audio.currentIngTime(ms / 1000);
      } else {
        audio.currentTime(ms / 1000);
      }
    }

    // 滚动/跳转到指定索引的歌词
    function seekToLyricWithIdx(index: number) {
      if (!!lockScroll.value) return;
      if (curLyricIdx.value === index) return;
      curLyricIdx.value = index;
      // scroll
      if (!!lyricsList.value) {
        const arr = Array.from(lyricsList.value.children).map((i) => i as HTMLElement);
        const currentLyricElement = arr[index];
        if (!!currentLyricElement) {
          const offset = index === 0 ? 0 : currentLyricElement.offsetTop - 53;
          lyricsList.value.scrollTo({
            top: offset,
            behavior: 'smooth'
          });
        }
      }
    }

    // 更新歌词数据
    async function updateLyricsData(info: typeof audioData.songInfo) {
      if (!!info) {
        const lyricsData = await getLyric(info.vendor, info.id);
        lyrics.original = lyricsData.data.lyric.map((item: [string, string]) => ({
          content: item[1],
          time: item[0],
          ms: (() => {
            const timeStr = item[0];
            const minute = parseInt(timeStr.substr(0, 2));
            const second = parseInt(timeStr.substr(3, 2));
            const ms = parseInt(timeStr.split('.')[1]);
            return minute * 60 * 1000 + second * 1000 + ms;
          })()
        }));
      }
    }

    // 当正在滚动时，锁定自动歌词滚动
    const debouncedOnWheelFunc = debounce(() => {
      lockScroll.value = false;
    }, 1500);

    function onWheel(_: WheelEvent) {
      lockScroll.value = true;
      debouncedOnWheelFunc();
    }

    let disposeLyricsWatch: WatchStopHandle = null;
    let disposeIngTimeWatch: WatchStopHandle = null;

    onMounted(() => {
      // 观察正在播放的音乐数据
      disposeLyricsWatch = watch(() => audioData.songInfo, updateLyricsData);

      // 观察播放进度
      disposeIngTimeWatch = watch(
        () => audioData.ingTime,
        (time) => {
          const ms = time * 1000;
          const lyricIdx = lyrics.original.findIndex(
            (item, idx) => item.ms <= ms && ms <= (lyrics.original[idx + 1]?.ms ?? Infinity)
          );
          seekToLyricWithIdx(lyricIdx);
        }
      );

      // 歌词加载
      if (lyrics.original.length === 0) updateLyricsData(audioData.songInfo);
    });

    onBeforeUnmount(() => {
      if (disposeLyricsWatch) disposeLyricsWatch();
      if (disposeIngTimeWatch) disposeIngTimeWatch();
    });

    // TODO 触控板触摸时禁止滚动歌词

    return {
      lyrics,
      curLyricIdx,
      lyricsList,
      hasLyrics,
      hasSong,
      seekAudioTimeWithLyricIdx,
      onWheel,
      lyricsListDom
    };
  }
});
</script>

<style lang='scss' scoped>
.lyrics-list {
  padding: 33px 20px 250px;
  overflow: auto;
  width: 100%;
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

.empty-lyrics-list {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;

  .empty-lyrics-list-label {
    font-size: 25px;
    color: var(--tertiary-label);
  }
}
</style>
