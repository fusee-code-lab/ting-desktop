<template>
  <div class="song-item">
    <div class="cover" :style="{ 'background-image': `url(${song.coverUrl})` }">
      <div class="img-cover">
        <i class="play-symbol"></i>
      </div>
    </div>
    <div class="title">{{ song.title }}</div>
    <div class="subtitle">{{ song.subtitle }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { SearchResultSongItem } from './SearchDetails.vue';

export default defineComponent({
  name: 'SongITem',
  props: {
    song: {
      type: Object as PropType<SearchResultSongItem>,
      required: true
    }
  },
  setup(props) {
    return {};
  }
});
</script>

<style lang="scss" scoped>
@import '~@/renderer/views/scss/mixin.scss';

.song-item:hover {
  > .cover {
    transform: scale(1.05) translateY(-5px);
    transition: all 0.2s ease-in-out;
  }

  > .cover > .img-cover {
    transition: all 0.2s ease-in-out;
    background-color: rgba($color: #333333, $alpha: 0.7); // TODO 使用颜色变量

    > .play-symbol {
      background-color: var(--white);
      transition: all 0.2s ease-in-out;
    }
  }
}

.song-item > .cover > .img-cover > .play-symbol:hover {
  background-color: var(--theme-blue);
  transition: all 0.2s ease-in-out;
}

.song-item {
  > .cover {
    width: 120px;
    height: 120px;
    border-radius: 2px;
    transition: all 0.1s ease-in-out;
    background-position: center;
    background-size: 100%;

    > .img-cover {
      width: 100%;
      height: 100%;
      position: relative;
      top: 0;
      left: 0;
      border-radius: 2px;
      transition: all 0.1s ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;

      > .play-symbol {
        width: 20px;
        height: 20px;
        background-color: transparent;
        transition: all 0.1s ease-in-out;
      }
    }
  }

  > .img-cover {
    position: relative;
    top: 0;
    left: 0;
    background-color: rebeccapurple;
  }

  > .title {
    @include text-overflow(1);
    color: var(--label);
    font: normal 14px/16px ping-fang;
  }

  > .subtitle {
    @include text-overflow(1);
    color: var(--tertiary-label);
    font: normal 12px/14px ping-fang;
  }
}
</style>
