<style lang="scss" scoped>
button {
  width: 120px;
  height: 32px;
  background-color: var(--bColor);
  outline: none;
  color: var(--white);
  font: 600 17px/32px segoe-ui;
}
</style>
<template>
  <button :style="{'--bColor':bColor}">{{ props.text }}</button>
</template>
<script>
export default {
  name: 'Button',
  props: {
    text: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      required: true
    },
  },
  setup(props) {
    let bColor = 'var(--theme-blue)';
    if (props.backgroundColor === 'pink') bColor = 'var(--theme-pink)';
    return {
      props,
      bColor
    }
  },
}
</script>