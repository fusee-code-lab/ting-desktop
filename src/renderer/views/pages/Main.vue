<template>
  <div class="container">
    <Head v-show="!isMini" />
    <div class="info" v-show="!isMini">
      <SideBar />
      <div class="content">
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
import { windowShow } from '@youliso/electronic/ipc';
import Head from '../components/Head.vue';
import Audio from '../components/Audio.vue';
import SearchDetails from './SearchDetails.vue';
import SheetDetails from './SheetDetails.vue';
import SidePopup from '../components/SidePopup.vue';
import LyricsList from '../components/LyricsList.vue';

export default defineComponent({
  components: {
    SideBar,
    SheetDetails,
    SearchDetails,
    Head,
    Audio,
    SidePopup,
    LyricsList
  },
  name: 'Main',
  setup() {
    switchAudioType(audioData.type);

    const isMini = computed(() => audioData.type === 'mini');

    const shownLyricsSidePopup = ref(false);

    onMounted(() => {
      windowShow();
    });

    return {
      isMini,
      shownLyricsSidePopup
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/renderer/views/scss/mixin.scss';
.container {
  > .info {
    height: 100%;
    position: relative;
    display: flex;

    > .content {
      position: relative;
      width: calc(100% - 220px);
      background-color: var(--white);

      > .navigation-bar {
        position: absolute;
        top: 0;
        z-index: 1000;
      }
    }
  }
}
</style>
