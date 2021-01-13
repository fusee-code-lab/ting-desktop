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
  <div class="container">
    <Head/>
    <div class="info">
      <div class="left">
        <Menu/>
      </div>
      <div class="right">
        <!--        <SearchDetails/>-->
        <Sheet/>
        <Audio/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {messageData} from "../../store";
import Head from "../components/Head.vue";
import Audio from "../components/Audio.vue";
import Menu from "../components/Menu.vue";
import SearchDetails from "../components/SearchDetails.vue";
import Sheet from "../components/Sheet.vue";

export default defineComponent({
  components: {
    Sheet,
    SearchDetails,
    Menu,
    Head,
    Audio
  },
  name: "Home",
  setup() {
    return {
      messageData
    }
  }
});
</script>
