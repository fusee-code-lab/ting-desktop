<template>
  <ul class="lyrics-list" ref="lyricsList">
    <li
        v-for="(item, idx) in lyrics.original"
        class="lyrics-item" :class="{ 'current': curLyricIdx === idx }"
        :key="idx"
        @click="seekAudioTimeWithLyricIdx(idx)"
        @wheel="onWheel"
    >
      <p class="original">{{ item.content }}</p>
    </li>
  </ul>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, watch } from "vue";
  import { AudiosOpt } from "@/core"
  import { getLyric } from "@/core/music"
  import { audio } from "@/core/audio";
  import { debounce } from "@/lib";

  interface SongLyrics {
    original: {
      content: string
      time: string
      ms: number
    }[]
  }

  export default defineComponent({
    name: "SidePopup",
    setup() {
      // 锁定自动歌词滚动
      const lockScroll = ref(false);
      // 歌词数据
      const lyrics = reactive<SongLyrics>({original: []})
      // 当前正在播放的索引
      const curLyricIdx = ref(0);
      // 歌词列表的 dom 元素
      const lyricsList = ref<HTMLElement | null>(null);

      // 使用歌词索引跳转播放时间
      function seekAudioTimeWithLyricIdx(index: number) {
        const ms = lyrics.original[index].ms;
        if (AudiosOpt.paused === 0) {
          audio.currentIngTime(ms / 1000);
        } else {
          audio.currentTime(ms / 1000);
        }
      }

      // 滚动/跳转到指定索引的歌词
      function seekToLyricWithIdx(index: number) {
        if (!!lockScroll.value) return
        if (curLyricIdx.value === index) return;
        curLyricIdx.value = index;
        // scroll
        if (!!lyricsList.value) {
          const arr = Array.from(lyricsList.value.children).map(i => i as HTMLElement);
          const currentLyricElement = arr[index];
          if (!!currentLyricElement) {
            const offset = index === 0
              ? 0
              : currentLyricElement.offsetTop - 53;
            lyricsList.value.scrollTo({
              top: offset,
              behavior: "smooth",
            });
          }
        }
      }

      // 更新歌词数据
      async function updateLyricsData(info: typeof AudiosOpt.songInfo) {
        if (!!info) {
          const lyricsData = await getLyric(info.vendor, info.id);
          lyrics.original = lyricsData.lyric.map((item: [string, string]) => ({
            content: item[1],
            time: item[0],
            ms: (() => {
              const timeStr = item[0];
              const minute = parseInt(timeStr.substr(0, 2));
              const second = parseInt(timeStr.substr(3, 2));
              const ms = parseInt(timeStr.split(".")[1]);
              return minute * 60 * 1000 + second * 1000 + ms;
            })()
          }));
        }
      }

      // 观察正在播放的音乐数据
      watch(() => AudiosOpt.songInfo, updateLyricsData)

      // 观察播放进度
      watch(() => AudiosOpt.ingTime, (time) => {
        const ms = time * 1000;
        const lyricIdx = lyrics.original.findIndex((item, idx) =>
          item.ms <= ms && ms <= (lyrics.original[idx + 1]?.ms ?? Infinity)
        )
        seekToLyricWithIdx(lyricIdx);
      })

      // 当正在滚动时，锁定自动歌词滚动
      const debouncedOnWheelFunc = debounce(() => {
        lockScroll.value = false;
      }, 1500);
      function onWheel(_: WheelEvent) {
        lockScroll.value = true;
        debouncedOnWheelFunc();
      }

      // TODO 触控板触摸时禁止滚动歌词

      return {
        lyrics,
        curLyricIdx,
        lyricsList,
        seekAudioTimeWithLyricIdx,
        onWheel,
      };
    }
  });
</script>

<style lang="scss" scoped>
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
        transition: color .3s ease-in-out;
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
</style>