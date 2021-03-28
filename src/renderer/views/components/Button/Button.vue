<template>
  <button
    :class="['ting-button', 'ting-button-' + buttonSize, { 'ting-button-disable': disable }]"
    :disable='disable'
    :type='nativeType'
    @click='handleClick'
  >
    <span v-if='$slots.default'>
      <slot></slot>
    </span>
  </button>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType, ref } from 'vue';
import { ButtonNativeType, ButtonSize } from './ButtonTypes';

export default defineComponent({
  name: 'Button',
  props: {
    size: {
      type: String as PropType<ButtonSize>,
      required: false,
      default: ButtonSize.normal
    },
    disable: {
      type: Boolean,
      required: false,
      default: false
    },
    nativeType: {
      type: String as PropType<ButtonNativeType>,
      required: false,
      default: ButtonNativeType.button
    }
  },
  emits: ['click'],
  setup(props, ctx) {
    const handleClick = (e) => {
      ctx.emit('click', e);
    };

    const buttonSize = computed<string>(() => props.size);
    const disable = computed(() => props.disable);

    return { buttonSize, disable, handleClick };
  }
});
</script>

<style lang='scss' scoped>

</style>
