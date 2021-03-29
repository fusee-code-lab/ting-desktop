<template>
  <div class="side-bar">
    <Search></Search>
    <Sheet></Sheet>
    <div class="setting-but bg-img"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Sheet from '../components/Sheet.vue';
import Search from '../components/Search.vue';

export default defineComponent({
  components: {
    Search,
    Sheet,
  },
  name: "SideBar",
  setup() {}
});
</script>

<style lang="scss" scoped>
@import '~@/renderer/views/scss/mixin.scss';

.side-bar {
  position: relative;
  height: 100%;
  width: 220px;
  background-color: #e3e3e8;
  padding: 40px 10px 0;

  > .setting-but {
    @include device-pixel('~@/renderer/assets/icons/setting_btn');
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: 12px;
  }
}
</style>
