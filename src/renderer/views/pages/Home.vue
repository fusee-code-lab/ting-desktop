<template>
  <div class="container" :class="platform" :style="{ '--accentColor': '#' + accentColor }">
    <Head v-show="audioData.type === 'normal'" />
    <div class="info" v-show="audioData.type === 'normal'">
      <div class="left">
        <Search></Search>
        <Sheet></Sheet>
        <div class="setting-but bg-img"></div>
      </div>
      <div class="right">
        <NavigationBar/>
        <SidePopup :shown="shownLyricsSidePopup" :position="'right'">
          <SongStatus />
        </SidePopup>
        <component :is="messageData[messageKeys.Show]" />
        <div
          class="null"
          v-if="!messageData[messageKeys.Show] || messageData[messageKeys.Show] === 'null'"
        >
          左边搜索~ (当前测试阶段)
        </div>
        <Audio v-model:showLyrics="shownLyricsSidePopup" />
      </div>
    </div>
    <div class="mini-info" v-if="audioData.type === 'mini'">
      <Audio />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { messageData, messageKeys, componentShow, argsData } from '../../store';
import Head from '../components/Head.vue';
import Audio from '../components/Audio.vue';
import Sheet from '../components/Sheet.vue';
import SearchDetails from '../components/SearchDetails/SearchDetails.vue';
import Search from '../components/Search.vue';
import SheetDetails from '../components/SheetDetails.vue';
import SidePopup from '../components/SidePopup.vue';
import SongStatus from '../components/SongStatus.vue';
import { windowShow } from '@/renderer/utils/window';
import { audioData, switchAudioType } from '@/renderer/core';
import NavigationBar from "@/renderer/views/components/NavigationBar.vue"

export default defineComponent({
  components: {
    Search,
    SheetDetails,
    SearchDetails,
    Sheet,
    Head,
    Audio,
    SidePopup,
    SongStatus,
    NavigationBar
  },
  name: 'Home',
  setup() {
    switchAudioType(audioData.type);

    const shownLyricsSidePopup = ref(false);

    function showLyricsSidePopup() {
      shownLyricsSidePopup.value = !shownLyricsSidePopup.value;
    }

    onMounted(() => {
      windowShow(argsData.window.id);
    });

    return {
      platform: argsData.window.platform,
      accentColor: argsData.window.appInfo.accentColor,
      messageData,
      audioData,
      messageKeys,
      componentShow,
      shownLyricsSidePopup,
      showLyricsSidePopup,
    };
  }
});
</script>
<style lang="scss" scoped>
@import '~@/renderer/views/scss/mixin.scss';

.info {
  height: 100%;
  position: relative;
  display: flex;

  > .left {
    position: relative;
    height: 100%;
    width: 220px;
    background-color: #e3e3e8;
    padding: 40px 10px 0;

    > .setting-but {
      @include device-pixel('~@/renderer/assets/icons/setting_btn');
      position: absolute;
      width: 16px;
      height: 16px;
      bottom: 12px;
    }
  }

  > .right {
    position: relative;
    width: calc(100% - 220px);
    padding-top: 40px;

    > .back {
      position: absolute;
      top: 0;
      left: 12px;
      font: 400 22px ping-fang;
      z-index: 1000;
    }

    > .null {
      text-align: center;
      font: 400 19px ping-fang;
    }
  }
}

.mini-info {
}
</style>
