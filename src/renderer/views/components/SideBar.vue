<template>
  <div class="side-bar">
    <Search></Search>
    <Sheet></Sheet>
    <div class="setting-but bg-img" @click="toSetting"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import Sheet from '../components/Sheet.vue';
import Search from '../components/Search.vue';

export default defineComponent({
  components: {
    Search,
    Sheet
  },
  name: 'SideBar',
  setup() {
    const router = useRouter();
    function toSetting() {
      router.replace('setting');
    }

    return {
      toSetting
    };
  }
});
</script>

<style lang="scss" scoped>
@import '~@/renderer/views/scss/mixin.scss';
@import '../scss/constants';

.side-bar {
  position: relative;
  height: 100%;
  width: $sidebar-width;
  background-color: rgba(255,255,255,.55);
  padding: 40px 10px 0;

  > .setting-but {
    @include device-pixel('~@/lib/assets/icons/setting_btn');
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: 12px;
  }
}
</style>
