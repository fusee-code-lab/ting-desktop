<template>
  <div class="navigation-bar">
    <div class="navigation-bar-content">
      <HoverButton
        v-if="canBack"
        @click="back"
      >
        <BackIcon />
      </HoverButton>
    </div>
  </div>
</template>

<script>
import BackIcon from '@/renderer/views/components/Icons/BackIcon.vue';
import HoverButton from '@/renderer/views/components/HoverButton.vue';

import { computed, defineComponent } from 'vue';
import { messageData, messageKeys } from '../../store';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'NavigationBar',
  components: {
    BackIcon,
    HoverButton
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();

    const canBack = computed(() => {
      const inMain = route.path.startsWith("/main");
      const historyCount = window.history.length;
      return inMain && historyCount > 1;
    }); 

    function back() {
      router.back();
    }

    return {
      back,
      canBack,
      messageData,
      messageKeys
    };
  }
});
</script>

<style lang="scss" scoped>
@import '../scss/constants.scss';

.navigation-bar {
  width: 100%;
  height: $title-bar-height;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 15px;
  padding-right: 15px;

  .navigation-bar-content {
    width: 100%;
  }
}
</style>
