<template>
  <div class="navigation-bar">
    <div class="navigation-bar-content">
      <HoverButton
        v-if="messageData[messageKeys.History] && messageData[messageKeys.History].length > 0"
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

import { defineComponent } from 'vue';
import { messageData, messageKeys } from '../../store';

export default defineComponent({
  name: 'NavigationBar',
  components: {
    BackIcon,
    HoverButton
  },
  setup(props) {
    function back() {
      messageData[messageKeys.History].shift();
      if (messageData[messageKeys.History].length > 0)
        messageData[messageKeys.Show] = messageData[messageKeys.History][0];
      else messageData[messageKeys.Show] = 'null';
    }

    return {
      back,
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
