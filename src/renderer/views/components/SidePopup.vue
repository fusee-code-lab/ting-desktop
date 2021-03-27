<template>
  <transition name='slide'>
    <div
      class='side-popup'
      :class="{ 'left': position === 'left', 'right': position === 'right' }"
      v-if='shown'
    >
      <slot></slot>
    </div>
  </transition>
</template>

<script lang='ts'>
import { defineComponent, toRefs, PropType } from 'vue';

export default defineComponent({
  name: 'SidePopup',
  props: {
    shown: Boolean,
    position: {
      type: String as PropType<'left' | 'right'>,
      default: 'right'
    }
  },
  setup(prop) {
    const { shown, position } = toRefs(prop);

    return {
      shown,
      position
    };
  }
});
</script>

<style lang='scss' scoped>
@import "~@/renderer/views/scss/mixin.scss";

.side-popup {
  position: absolute;
  z-index: z("side-popup");
  top: 0;
  width: 298px;
  height: 100%;
  background-color: var(--blur-background);
  backdrop-filter: saturate(180%) blur(60px);
  transition: all 0.2s ease-in-out;
}

.side-popup.left {
  left: 0;
  border-right: var(--separator-color) 0.5px solid;
}

.side-popup.right {
  right: 0;
  border-left: var(--separator-color) 0.5px solid;
}

.slide-enter-active,
.slide-leave-active {
}

.slide-enter-from.right,
.slide-leave-to.right {
  transform: translateX(100%);
}

.slide-enter-from.left,
.slide-leave-to.left {
  transform: translateX(-100%);
}
</style>
