<template>
  <div class="audio-info no-drag">
    <div class="audio-info-progress">
      <input type="range" class="progress-input"
             :style="{'--audio-progres':`linear-gradient(to right, var(--theme-blue) ${isProgress===1?speedProgress/co.allTime.toFixed(0)*100:co.ingTime/co.allTime.toFixed(0)*100}%, #fff 0%)`}"
             :max="co.allTime.toFixed(0)"
             min="0"
             step="any"
             @input="speedProgress=$event.target.value"
             @mousedown="isProgress=1"
             @mouseup="co.paused===0?audio.currentIngTime(speedProgress):audio.currentTime(speedProgress);oProgress()"
             :value="isProgress===1?speedProgress:co.ingTime"/>
    </div>
    <div class="audio-info-content">
      <div class="audio-info-song">
        <div class="cover">
          <img v-if="co.songInfo"
               :src="co.songInfo.cover+`${co.songInfo.vendor==='netease'?'?param=35y35':''}`">
        </div>
        <div class="content">
          <div v-if="co.songInfo" class="song-name">{{ co.songInfo.name }}</div>
          <div v-if="co.songInfo" class="song-singer"> {{ co.songInfo.singer }}</div>
        </div>
      </div>
      <div class="audio-info-buts">
        <div class="pre" @click="audio.pre()"></div>
        <div v-if="co.paused===0" class="play" @click="play()"></div>
        <div v-if="co.paused===1" class="pause" @click="pause()"></div>
        <div class="next" @click="audio.next()"></div>
        <div class="rules">
          <div class="random"></div>
          <div @click="audio.loop(true)" class="single"></div>
        </div>
        <div class="volume">
          <div class="volume-icon"></div>
          <input class="volume-input" type="range" max="100" min="0" step="1"
                 :style="{'--audio-volume':`linear-gradient(to right, var(--theme-blue) ${co.volume*100}%, #F2F2F7 0%)`}"
                 :value="parseInt((co.volume * 100).toString())" @input="audio.setVolume($event.target.value)"/>
        </div>
      </div>
      <div class="audio-info-menu">
        <div class="sheet"></div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {audioData} from "@/core";
import {audio} from "@/core/audio";

export default defineComponent({
  name: "Audio",
  setup() {

    const isProgress = ref(0); //是否正在拖动进度
    const speedProgress = ref(0); //拖动进度结果

    async function play() {
      await audio.play();
    }

    async function pause() {
      await audio.pause();
    }

    async function oProgress() {//拖动后延迟0.1秒后显示
      setTimeout(() => {
        isProgress.value = 0;
      }, 100)
    }

    return {
      co: audioData,
      audio,
      isProgress,
      speedProgress,
      play,
      pause,
      oProgress
    }
  }
});
</script>

<style lang="scss" scoped>
@import "../scss/audio";
</style>
