<style lang="scss">
.head-info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 32px;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > .win32, .darwin {
    padding: 0 10px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    > .title {
      font: normal 13px /13px ping-fang;
    }
  }

  > .win32 {
    > .events {
      display: flex;
      justify-content: space-between;
      align-items: center;

      > .event {
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        width: 15px;
        height: 15px;
        margin-left: 4px;
      }

      > .event:hover {
        opacity: .9;
      }

      > .event:active {
        opacity: .7;
      }

      > .close {
        background-color: var(--red);
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

<template>
  <div class="head-info drag">
    <div v-if="platform==='win32'" :class="platform">
      <div class="title">
        <span v-if="audioData.type !== 'mini'">{{ title }}</span>
      </div>
      <div class="events" v-if="audioData.type !== 'mini'">
        <div @click="close" class="event close no-drag cursor-pointer"></div>
      </div>
      <div class="events" v-if="audioData.type === 'mini'">
        <div @click="windowSize" class="event normal no-drag cursor-pointer"></div>
        <div @click="top" class="event top no-drag cursor-pointer"></div>
      </div>
    </div>
    <div v-else-if="platform==='darwin'" :class="platform">
      <div></div>
      <div class="title" v-if="audioData.type !== 'mini'">
        <span v-if="audioData.type !== 'mini'">{{ title }}</span>
      </div>
      <div class="events" v-if="audioData.type === 'mini'">
        <div @click="windowSize" class="event normal no-drag cursor-pointer"></div>
        <div @click="top" class="event top no-drag cursor-pointer"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {argsData} from "@/renderer/store";
import {windowAlwaysOnTop, windowClose, windowSetSize} from "@/renderer/utils/window";
import {audioData} from "@/renderer/core";

export default defineComponent({
  name: "Head",
  setup() {

    let isAlwaysOnTop = false;

    function close() {
      windowClose(argsData.window.id);
    }

    function windowSize() {
      windowSetSize(argsData.window.id, [980, 700]);
      audioData.type = "normal";
    }

    function top() {
      windowAlwaysOnTop(argsData.window.id, !isAlwaysOnTop, "pop-up-menu");
      isAlwaysOnTop = !isAlwaysOnTop;
    }

    return {
      top,
      close,
      windowSize,
      title: argsData.window.title || argsData.window.appInfo.name,
      platform: argsData.window.platform,
      audioData
    }
  }
});
</script>
