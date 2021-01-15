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
        <SidePopup :shown="shownLyricsSidePopup" :position="'right'">
          <SongStatus/>
        </SidePopup>
        <SearchDetails/>
        <!-- <SheetDetails/>-->
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
import Sheet from "../components/Sheet.vue";
import SearchDetails from "../components/SearchDetails.vue";
import Search from "@/renderer/views/components/Search.vue";
import SheetDetails from "@/renderer/views/components/SheetDetails.vue";
import SidePopup from "@/renderer/views/components/SidePopup.vue";
import SongStatus from "@/renderer/views/pages/SongStatus.vue";
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
      console.log("show lyrics", shownLyricsSidePopup.value)
    }

    return {
      platform: getGlobal("platform"),
      accentColor: getGlobal("appInfo")["accentColor"],
      messageData,
      shownLyricsSidePopup,
      showLyricsSidePopup
    }
  }
});
</script>
