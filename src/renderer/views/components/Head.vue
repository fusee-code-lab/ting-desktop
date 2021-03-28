<template>
  <div class="head-info drag">
    <div v-if="platform === 'darwin'" :class="platform">
      <div @dblclick="maxMin" class="head-content" />
    </div>
    <div v-else :class="platform">
      <div @dblclick="maxMin" class="head-content">
        <div class="title">
          <span>{{ title }}</span>
        </div>
      </div>
      <div class="events">
        <div @click="minimize" class="event close no-drag">
          <MinimizeIcon />
        </div>
        <div @click="maximize" class="event close no-drag">
          <MaximizeIcon />
        </div>
        <div @click="close" class="event close no-drag">
          <CloseIcon />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { argsData } from '@/renderer/store';
import { windowHide, windowMax, windowMaxMin, windowMin } from '@/renderer/utils/window';
import { audioData } from '@/renderer/core';
import CloseIcon from '@/renderer/views/components/Icons/CloseIcon.vue';
import MinimizeIcon from '@/renderer/views/components/Icons/MinimizeIcon.vue';
import MaximizeIcon from '@/renderer/views/components/Icons/MaximizeIcon.vue';

export default defineComponent({
  name: 'Head',
  components: {
    CloseIcon,
    MinimizeIcon,
    MaximizeIcon
  },
  setup() {
    function close() {
      windowHide(argsData.window.id);
    }

    function minimize() {
      windowMin(argsData.window.id);
    }

    function maximize() {
      windowMax(argsData.window.id);
    }

    function maxMin() {
      windowMaxMin(argsData.window.id);
    }

    return {
      close,
      minimize,
      maximize,
      maxMin,
      title: argsData.window.title || argsData.window.appInfo.name,
      platform: argsData.window.platform,
      audioData
    };
  }
});
</script>
<style lang="scss">
@import '~@/renderer/views/scss/mixin.scss';
@import '../scss/constants.scss';

.head-info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: $title-bar-height;
  z-index: z('head');
  display: flex;
  justify-content: space-between;
  align-items: center;

  > .win32,
  .darwin,
  .linux {
    padding: 0 10px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    > .head-content {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;

      > .title {
        font: normal 13px /13px ping-fang;
      }
    }
  }

  > .win32,
  .linux {
    > .events {
      display: flex;
      justify-content: space-between;
      align-items: center;

      > .event {
        width: 40px;
        height: 100%;
        margin-left: 8px;
        text-align: center;

        > * {
          font-size: 10px !important;
        }
      }

      > .event:hover {
        opacity: 0.9;
      }

      > .event:active {
        opacity: 0.7;
      }

      > .normal {
        background-color: var(--theme-blue);
      }

      > .top {
        background-color: var(--theme-pink);
      }
    }
  }
}
</style>
