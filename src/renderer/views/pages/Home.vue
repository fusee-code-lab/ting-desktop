<template>
  <div class="container" :class="platform" :style="{'--accentColor':'#'+accentColor}">
    <Head/>
    <div class="info" v-if="audioData.type==='normal'">
      <div class="left">
        <Search></Search>
        <Sheet></Sheet>
      </div>
      <div class="right">
        <div class="back no-drag cursor-pointer"
             v-if="messageData[messageKeys.History]&&messageData[messageKeys.History].length>0"
             @click="back()">←
        </div>
        <SidePopup :shown="shownLyricsSidePopup" :position="'right'">
          <SongStatus/>
        </SidePopup>
        <component :is="messageData[messageKeys.Show]"/>
        <div class="null"
             v-if="!messageData[messageKeys.Show] || messageData[messageKeys.Show]==='null'">
          左边搜索~ (当前测试阶段)
        </div>
        <Audio @show-lyrics="showLyricsSidePopup"/>
      </div>
    </div>
    <div class="mini-info" v-else-if="audioData.type==='mini'">
      <Audio/>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {messageData, messageKeys, componentShow, argsData} from "../../store";
import Head from "../components/Head.vue";
import Audio from "../components/Audio.vue";
import Sheet from "../components/Sheet.vue";
import SearchDetails from "../components/SearchDetails/SearchDetails.vue";
import Search from "../components/Search.vue";
import SheetDetails from "../components/SheetDetails.vue";
import SidePopup from "../components/SidePopup.vue";
import SongStatus from "../components/SongStatus.vue";
import {windowShow} from "@/renderer/utils/window";
import {audioData} from "@/renderer/core";

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
  },
  name: "Home",
  setup() {

    const shownLyricsSidePopup = ref(false);

    function showLyricsSidePopup() {
      shownLyricsSidePopup.value = !shownLyricsSidePopup.value;
    }

    function back() {
      messageData[messageKeys.History].shift();
      if (messageData[messageKeys.History].length > 0) messageData[messageKeys.Show] = messageData[messageKeys.History][0];
      else messageData[messageKeys.Show] = "null";
    }

    onMounted(() => {
      windowShow(argsData.window.id);
    })

    return {
      platform: argsData.window.platform,
      accentColor: argsData.window.appInfo.accentColor,
      messageData,
      audioData,
      messageKeys,
      componentShow,
      shownLyricsSidePopup,
      showLyricsSidePopup,
      back
    }
  }
});
</script>
<style lang="scss" scoped>
.info {
  height: 100%;
  position: relative;
  display: flex;

  > .left {
    position: relative;
    height: 100%;
    width: 220px;
    background-color: #E3E3E8;
    padding: 40px 10px 0;
  }

  > .right {
    position: relative;
    width: calc(100% - 220px);

    > .back {
      position: absolute;
      top: 0;
      left: 12px;
      font: 400 22px ping-fang;
      z-index: 1000;
    }

    > .null {
      padding: 40px 0;
      text-align: center;
      font: 400 19px ping-fang;
    }

  }
}
</style>