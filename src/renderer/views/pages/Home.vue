<style lang="scss" scoped>
.info {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-shrink: 0;

  > .left {
    position: relative;
    width: 20%;
    height: 100%;
    min-width: 220px;
    max-width: 320px;
    background-color: #E3E3E8;
    padding: 40px 10px 0;
  }

  > .right {
    position: relative;
    width: 100%;

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

<template>
  <div class="container" :class="platform" :style="{'--accentColor':'#'+accentColor}">
    <Head/>
    <div class="info">
      <div class="left">
        <Search></Search>
        <Sheet></Sheet>
      </div>
      <div class="right">
        <div class="back no-drag cursor-pointer" @click="back()">←</div>
        <SidePopup :shown="shownLyricsSidePopup" :position="'right'">
          <SongStatus/>
        </SidePopup>
        <SearchDetails v-if="messageData[messageKeys.Show] === componentShow.SearchDetails"/>
        <SheetDetails v-else-if="messageData[messageKeys.Show] === componentShow.SheetDetails"/>
        <div v-else class="null">左边搜索~ (当前测试阶段)</div>
        <Audio @show-lyrics="showLyricsSidePopup"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {messageData, messageKeys, componentShow} from "../../store";
import Head from "../components/Head.vue";
import Audio from "../components/Audio.vue";
import Sheet from "../components/Sheet.vue";
import SearchDetails from "../components/SearchDetails.vue";
import Search from "../components/Search.vue";
import SheetDetails from "../components/SheetDetails.vue";
import SidePopup from "../components/SidePopup.vue";
import SongStatus from "../components/SongStatus.vue";
import {getGlobal} from "@/lib";

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
      messageData[messageKeys.Show] = messageData[messageKeys.History][1];
    }

    return {
      platform: getGlobal("platform"),
      accentColor: getGlobal("appInfo")["accentColor"],
      messageData,
      messageKeys,
      componentShow,
      shownLyricsSidePopup,
      showLyricsSidePopup,
      back
    }
  }
});
</script>
