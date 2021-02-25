<template>
  <div class="head-info drag">
    <div v-if="platform==='darwin'" :class="platform">
      <div></div>
      <div class="title">
        <span>{{ title }}</span>
      </div>
    </div>
    <div v-else :class="platform">
      <div class="title">
        <span>{{ title }}</span>
      </div>
      <div class="events">
        <div @click="close" class="event close no-drag cursor-pointer"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {argsData} from "@/renderer/store";
import {windowClose} from "@/renderer/utils/window";
import {audioData} from "@/renderer/core";

export default defineComponent({
  name: "Head",
  setup() {

    function close() {
      windowClose(argsData.window.id);
    }

    return {
      close,
      title: argsData.window.title || argsData.window.appInfo.name,
      platform: argsData.window.platform,
      audioData
    }
  }
});
</script>
<style lang="scss">
@import "~@/renderer/views/scss/mixin.scss";
.head-info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 32px;
  z-index: z("head");
  display: flex;
  justify-content: space-between;
  align-items: center;

  > .win32, .darwin,.linux {
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

  > .win32 ,.linux {
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