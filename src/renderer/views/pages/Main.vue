<template>
  <div class="container" :class="platform" :style="{ '--accentColor': '#' + accentColor }">
    <Head v-show="!isMini" />
    <div class="info" v-show="!isMini">
      <SideBar />
      <div class="content">
        <NavigationBar class="navigation-bar" />
        <SidePopup :shown="shownLyricsSidePopup" :position="'right'">
          <LyricsList />
        </SidePopup>
        <router-view></router-view>
        <Audio v-model:showLyrics="shownLyricsSidePopup" />
      </div>
    </div>
    <div class="mini-info" v-if="isMini">
      <Audio />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import SideBar from '@/renderer/views/components/SideBar.vue';
import { audioData, switchAudioType } from '@/renderer/core';
import { argsData } from '@/renderer/store';
import { windowShow } from '@/renderer/utils/window';
import Head from '../components/Head.vue';
import Audio from '../components/Audio.vue';
import SearchDetails from './SearchDetails.vue';
import SheetDetails from '../components/SheetDetails.vue';
import SidePopup from '../components/SidePopup.vue';
import LyricsList from '../components/LyricsList.vue';
import NavigationBar from '@/renderer/views/components/NavigationBar.vue';

export default defineComponent({
  components: {
    SideBar,
    SheetDetails,
    SearchDetails,
    Head,
    Audio,
    SidePopup,
    LyricsList,
    NavigationBar
  },
  name: 'Main',
  setup() {
    switchAudioType(audioData.type);

    const isMini = computed(() => audioData.type === 'mini');

    const shownLyricsSidePopup = ref(false);

    onMounted(() => {
      windowShow(argsData.window.id);
    });

    return {
      isMini,
      platform: argsData.window.platform,
      accentColor: argsData.window.appInfo.accentColor,
      shownLyricsSidePopup,
    };
  }
});
</script>

<style lang="scss" scoped>
@import '~@/renderer/views/scss/mixin.scss';

.container {
  > .info {
    height: 100%;
    position: relative;
    display: flex;

    > .content {
      position: relative;
      width: calc(100% - 220px);

      > .navigation-bar {
        position: absolute;
        top: 0;
        z-index: 1000;
      }
    }
  }
}
</style>
