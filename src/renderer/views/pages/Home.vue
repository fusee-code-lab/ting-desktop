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
    min-width: 220px;
    max-width: 320px;
  }

  > .right {
    position: relative;
    width: 100%;
    padding: 32px 0 0;
  }
}
</style>

<template>
  <div class="container" :class="platform">
    <Head/>
    <div class="info">
      <div class="left">
        <Menu/>
      </div>
      <div class="right">
        <SidePopup :shown="shownLyricsSidePopup" :position="'right'">
          <SongStatus/>
        </SidePopup>
        <SearchDetails/>
        <!--        <Sheet/>-->
        <Audio @show-lyrics="showLyricsSidePopup"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {messageData} from "../../store";
import Head from "../components/Head.vue";
import Audio from "../components/Audio.vue";
import Menu from "../components/Menu.vue";
import SearchDetails from "../components/SearchDetails.vue";
import Sheet from "@/renderer/views/components/Sheet.vue";
import SidePopup from "@/renderer/views/components/SidePopup.vue";
import SongStatus from "@/renderer/views/pages/SongStatus.vue";
import {getGlobal} from "@/lib";

export default defineComponent({
  components: {
    Sheet,
    SearchDetails,
    Menu,
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
      console.log("show lyrics", shownLyricsSidePopup.value)
    }

    return {
      platform: getGlobal("platform"),
      messageData,
      shownLyricsSidePopup,
      showLyricsSidePopup
    }
  }
});
</script>
