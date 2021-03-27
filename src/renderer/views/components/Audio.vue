<template>
  <div class='audio-info bg-img' v-if='co.songInfo' :class='co.type'
       :style="{'--songCover': 'url('+ co.songInfo.cover+`${co.songInfo.vendor==='netease'?'?param=35y35':''}`+')'}">
    <div class='audio-info-progress'>
      <input type='range' class='progress-input'
             :style="{'--audio-progres':`linear-gradient(to right, var(--theme-blue) ${isProgress===1?speedProgress/co.allTime.toFixed(0)*100:co.ingTime/co.allTime.toFixed(0)*100}%, transparent 0%)`}"
             :max='co.allTime.toFixed(0)'
             min='0'
             step='any'
             @input='speedProgress=$event.target.value'
             @mousedown='isProgress=1'
             @mouseup='co.paused===1?audio.currentIngTime(speedProgress):audio.currentTime(speedProgress);oProgress()'
             :value='isProgress===1?speedProgress:co.ingTime' />
    </div>
    <div v-if="co.type==='normal'" class='audio-info-content'>
      <div class='audio-info-song'>
        <div class='cover'>
          <img v-if='co.songInfo'
               :src="co.songInfo.cover+`${co.songInfo.vendor==='netease'?'?param=35y35':''}`">
        </div>
        <div class='content'>
          <div v-if='co.songInfo' class='song-name'>{{ co.songInfo.name }}</div>
          <div v-if='co.songInfo' class='song-singer'> {{ co.songInfo.singer }}</div>
        </div>
      </div>
      <div class='audio-info-buts'>
        <div class='pre' @click='audio.next(-1)'>
          <PreviousIcon />
        </div>
        <div class='play-pause' @click='playPause'>
          <PauseStatusIcon v-if='isPaused === 1' />
          <PlayStatusIcon v-if='isPaused === 0' />
        </div>
        <div class='next' @click='audio.next(1)'>
          <NextIcon />
        </div>
        <div class='rules'>
          <div class='shuffle' :class='{ active: isShuffle }' @click='switchShuffle'>
            <ShuffleIcon />
          </div>
          <div class='repeat' :class='{ active: isRepeat }' @click='switchRepeat'>
            <RepeatIcon />
          </div>
        </div>
        <div class='volume'>
          <div class='volume-icon'>
            <Volumes1Icon v-if='co.volume <= 0.3' />
            <Volumes2Icon v-else-if='co.volume <= 0.6' />
            <Volumes3Icon v-else />
          </div>
          <input
            class='volume-input'
            type='range' max='100' min='0' step='1'
            :style="{
              '--audio-volume':`linear-gradient(to right, var(--theme-blue) ${co.volume*100}%, #F2F2F7 0%)`
            }"
            :value='parseInt((co.volume * 100).toString())' @input='audio.setVolume($event.target.value)'
          />
        </div>
      </div>
      <div class='audio-info-menu'>
        <div class='lyrics-btn' :class='{ active: isShowLyrics }' @click='onLyricsButtonClick'>
          <LyricsIcon />
        </div>
        <div class='option-btn'>
          <MenuIcon />
        </div>
      </div>
    </div>
    <div v-if="co.type==='mini'" class='audio-info-mini drag'>
      <div class='head'>
        <div class='reduction no-drag' @click='switchAudioType()'></div>
        <div class='top no-drag' @click='top()'></div>
      </div>
      <div class='audio-info-song'>
        <div class='cover'>
          <img v-if='co.songInfo'
               :src="co.songInfo.cover+`${co.songInfo.vendor==='netease'?'?param=35y35':''}`">
        </div>
        <div class='content'>
          <div v-if='co.songInfo' class='song-name'>{{ co.songInfo.name }}</div>
          <div v-if='co.songInfo' class='song-singer'> {{ co.songInfo.singer }}</div>
        </div>
      </div>
      <div class='audio-info-buts'>
        <div class='rules no-drag'>
          <div class='random' @click='rules(PlayTypeOpt.random)'></div>
          <div class='single' @click='rules(PlayTypeOpt.single)'></div>
        </div>
        <div class='buts no-drag'>
          <div class='pre' @click='audio.pre()'></div>
          <div v-if='isPaused===1' class='play' @click='play()'></div>
          <div v-if='isPaused===0' class='pause' @click='pause()'></div>
          <div class='next' @click='audio.next()'></div>
        </div>
      </div>
    </div>
  </div>
  <div class='audio-info audio-null' v-else>
    Ting ~
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, ref, watch } from 'vue';
import { audioData, PlayTypeOpt, switchAudioType } from '@/renderer/core';
import { audio } from '@/renderer/core/audio';
import { windowAlwaysOnTop } from '@/renderer/utils/window';
import { argsData } from '@/renderer/store';
import LyricsIcon from '@/renderer/views/components/Icons/LyricsIcon.vue';
import PlayStatusIcon from '@/renderer/views/components/Icons/PlaystatusIcon.vue';
import PauseStatusIcon from '@/renderer/views/components/Icons/PausestatusIcon.vue';
import PreviousIcon from '@/renderer/views/components/Icons/PreviousIcon.vue';
import NextIcon from '@/renderer/views/components/Icons/NextIcon.vue';
import ShuffleIcon from '@/renderer/views/components/Icons/ShuffleIcon.vue';
import RepeatIcon from '@/renderer/views/components/Icons/RepeatIcon.vue';
import Volumes1Icon from '@/renderer/views/components/Icons/Volumes1Icon.vue';
import Volumes2Icon from '@/renderer/views/components/Icons/Volumes2Icon.vue';
import Volumes3Icon from '@/renderer/views/components/Icons/Volumes3Icon.vue';
import MenuIcon from '@/renderer/views/components/Icons/MenuIcon.vue';

export default defineComponent({
  name: 'Audio',
  components: {
    LyricsIcon,
    PlayStatusIcon,
    PauseStatusIcon,
    PreviousIcon,
    NextIcon,
    ShuffleIcon,
    RepeatIcon,
    Volumes1Icon,
    Volumes2Icon,
    Volumes3Icon,
    MenuIcon
  },
  emits: ['update:showLyrics'],
  props: {
    showLyrics: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props, context) {
    const isPaused = ref(1); //是否暂停
    const isProgress = ref(0); //是否正在拖动进度
    const speedProgress = ref(0); //拖动进度结果
    const isRandom = ref(false); // 是否开启随机播放
    const isSingle = computed(() => audioData.playType === PlayTypeOpt.single); // 是否开启单曲循环
    const isShowLyrics = ref(props.showLyrics); // 是否显示歌词

    let isAlwaysOnTop = false;

    watch(() => audioData.paused, (n) => {
      isPaused.value = n;
    });

    function top() {
      windowAlwaysOnTop(argsData.window.id, !isAlwaysOnTop, 'pop-up-menu');
      isAlwaysOnTop = !isAlwaysOnTop;
    }

    function playPause() {
      if (isPaused.value === 0) {
        audio.pause();
        isPaused.value = 1;
      } else {
        audio.play();
        isPaused.value = 0;
      }
    }

    function oProgress() {//拖动后延迟0.1秒后显示
      setTimeout(() => {
        isProgress.value = 0;
      }, 100);
    }

    function onLyricsButtonClick() {
      isShowLyrics.value = !isShowLyrics.value;
      context.emit('update:showLyrics', isShowLyrics.value);
    }

    function applyPlayType() {
      audioData.playType = isRandom.value ? PlayTypeOpt.random : PlayTypeOpt.list;
    }

    function switchShuffle() {
      isRandom.value = !isRandom.value;
      if (!isSingle.value) {
        applyPlayType();
      }
    }

    function switchRepeat() {
      if (!isSingle.value) {
        audioData.playType = PlayTypeOpt.single;
      } else {
        applyPlayType();
      }
    }

    return {
      co: audioData,
      isPaused,
      audio,
      isProgress,
      speedProgress,
      PlayTypeOpt,
      top,
      switchAudioType,
      playPause,
      oProgress,
      onLyricsButtonClick,
      isRepeat: isSingle,
      switchRepeat,
      isShuffle: isRandom,
      switchShuffle,
      isShowLyrics
    };
  }
});
</script>
<style lang='scss' scoped>
@import "../scss/audio";
</style>
