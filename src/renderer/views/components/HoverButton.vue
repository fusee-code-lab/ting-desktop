<template>
  <div class="hover-button no-drag" :class="classNames">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";

export enum HoverButtonVariants {
  background = "background",
  content = "content"
}

export default defineComponent({
  name: "HoverButton",
  props: {
    variant: {
      type: String as PropType<| HoverButtonVariants.content
        | HoverButtonVariants.background>,
      default: HoverButtonVariants.background,
      required: false
    }
  },
  setup(props) {
    const classNames = ref({
      "variant-bc": props.variant === HoverButtonVariants.background,
      "variant-ct": props.variant === HoverButtonVariants.content
    });

    return { classNames };
  }
});
</script>

<style lang='scss' scoped>
@import "../scss/constants";

.hover-button.variant-bc:hover {
  background-color: var(--hover-background);
  @include quick-transition(background-color);
}

.hover-button.variant-bc:active {
  background-color: var(--hover-background-active);
  @include quick-transition(background-color);
}

.hover-button.variant-ct:hover {
  :first-child {
    color: var(--hover-content-background);
    @include quick-transition(color);
  }
}

.hover-button.variant-ct:active {
  :first-child {
    color: var(--hover-content-background-active);
    @include quick-transition(color);
  }
}

.hover-button {
  width: 25px;
  height: 25px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color .1s ease-in;
}
</style>
