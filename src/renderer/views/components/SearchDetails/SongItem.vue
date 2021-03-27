<template>
  <div class='song-item'>
    <div class='cover' :style='coverImageStyle'>
      <div class='img-cover'>
        <PlayIcon class='play-symbol' />
      </div>
    </div>
    <div class='title'>{{ song.title }}</div>
    <div class='subtitle'>{{ song.subtitle }}</div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, PropType, reactive } from 'vue';
import { SearchResultSongItem } from './SearchDetails.vue';
import PlayIcon from '@/renderer/views/components/Icons/PausestatusIcon.vue';

export default defineComponent({
  name: 'SongITem',
  components: {
    PlayIcon
  },
  props: {
    song: {
      type: Object as PropType<SearchResultSongItem>,
      required: true
    }
  },
  setup(props) {
    let coverImageStyle = reactive({
      backgroundImage: 'transport',
      opacity: 0
    });

    onMounted(() => {
      const coverImage = new Image();
      coverImage.src = props.song.coverUrl;
      coverImage.onload = () => {
        coverImageStyle.backgroundImage = `url(${coverImage.src})`;
        coverImageStyle.opacity = 1;
      };
    });

    return { coverImageStyle };
  }
});
</script>

<style lang='scss' scoped>
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
      color: var(--contrast-label);
      transition: all 0.2s ease-in-out;
    }
  }
}

.song-item > .cover > .img-cover > .play-symbol:hover {
  color: var(--theme-blue);
  transition: all 0.2s ease-in-out;
}

.song-item {
  > .cover {
    transform: scale(1);
    width: 100%;
    border-radius: 3px;
    background-position: top left;
    background-size: 100% auto;
    background-repeat: no-repeat;
    transition: opacity 0.5s;

    > .img-cover {
      width: 100%;
      // CSS trick: 使用 padding-bottom 来实现固定宽高比
      padding-bottom: 100%;
      top: 0;
      left: 0;
      border-radius: 2px;
      transition: all 0.1s ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;

      > .play-symbol {
        color: transparent;
        transition: color 0.1s ease-in-out;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 25px;
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
    margin-top: 5px;
  }

  > .subtitle {
    @include text-overflow(1);
    color: var(--tertiary-label);
    font: normal 12px/14px ping-fang;
    margin-top: 1px;
  }
}
</style>
