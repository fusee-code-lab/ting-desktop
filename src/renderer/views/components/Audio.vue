<template>
  <div class="audio-info bg-img" v-if="co.songInfo" :class="co.type"
       :style="{'--songCover': 'url('+ co.songInfo.cover+`${co.songInfo.vendor==='netease'?'?param=35y35':''}`+')'}">
    <div class="audio-info-progress">
      <input type="range" class="progress-input"
             :style="{'--audio-progres':`linear-gradient(to right, var(--theme-blue) ${isProgress===1?speedProgress/co.allTime.toFixed(0)*100:co.ingTime/co.allTime.toFixed(0)*100}%, transparent 0%)`}"
             :max="co.allTime.toFixed(0)"
             min="0"
             step="any"
             @input="speedProgress=$event.target.value"
             @mousedown="isProgress=1"
             @mouseup="co.paused===1?audio.currentIngTime(speedProgress):audio.currentTime(speedProgress);oProgress()"
             :value="isProgress===1?speedProgress:co.ingTime"/>
    </div>
    <div v-if="co.type==='normal'" class="audio-info-content">
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
        <div class="pre" @click="audio.next(-1)"></div>
        <div v-if="co.paused===1" class="play" @click="play()"></div>
        <div v-if="co.paused===0" class="pause" @click="pause()"></div>
        <div class="next" @click="audio.next(1)"></div>
        <div class="rules">
          <div class="random" @click="rules(PlayTypeOpt.random)"></div>
          <div class="single" @click="rules(PlayTypeOpt.single)"></div>
        </div>
        <div class="volume">
          <div class="volume-icon"></div>
          <input class="volume-input" type="range" max="100" min="0" step="1"
                 :style="{'--audio-volume':`linear-gradient(to right, var(--theme-blue) ${co.volume*100}%, #F2F2F7 0%)`}"
                 :value="parseInt((co.volume * 100).toString())" @input="audio.setVolume($event.target.value)"/>
        </div>
      </div>
      <div class="audio-info-menu">
        <div class="sheet" @click="onLyricsButtonClick"></div>
      </div>
    </div>
    <div v-if="co.type==='mini'" class="audio-info-mini drag">
      <div class="head">
        <div class="reduction no-drag" @click="switchAudioType()"></div>
        <div class="top no-drag" @click="top()"></div>
      </div>
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
        <div class="rules no-drag">
          <div class="random" @click="rules(PlayTypeOpt.random)"></div>
          <div class="single" @click="rules(PlayTypeOpt.single)"></div>
        </div>
        <div class="buts no-drag">
          <div class="pre" @click="audio.pre()"></div>
          <div v-if="co.paused===1" class="play" @click="play()"></div>
          <div v-if="co.paused===0" class="pause" @click="pause()"></div>
          <div class="next" @click="audio.next()"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {switchAudioType, audioData, PlayTypeOpt} from "@/renderer/core";
import {audio} from "@/renderer/core/audio";
import {windowAlwaysOnTop,} from "@/renderer/utils/window";
import {argsData} from "@/renderer/store";

export default defineComponent({
  name: "Audio",
  emits: ["show-lyrics"],
  setup(_, context) {

    const isProgress = ref(0); //是否正在拖动进度
    const speedProgress = ref(0); //拖动进度结果

    let isAlwaysOnTop = false;

    function top() {
      windowAlwaysOnTop(argsData.window.id, !isAlwaysOnTop, "pop-up-menu");
      isAlwaysOnTop = !isAlwaysOnTop;
    }

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

    function onLyricsButtonClick() {
      context.emit("show-lyrics")
    }

    function rules(type: PlayTypeOpt) {
      audioData.playType = type;
    }

    return {
      co: audioData,
      audio,
      isProgress,
      speedProgress,
      PlayTypeOpt,
      top,
      switchAudioType,
      play,
      pause,
      oProgress,
      onLyricsButtonClick,
      rules
    }
  }
});
</script>
<style lang="scss" scoped>
@import "../scss/audio";
</style>