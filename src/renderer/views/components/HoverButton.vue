<template>
  <div class='hover-button no-drag'>
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: "HoverButton",
  setup(props) {
    return {}
  }
});
</script>

<style lang='scss' scoped>
.hover-button:hover {
  background-color: var(--hover-background);
  transition: background-color .15s ease-in;
}

.hover-button:active {
  background-color: var(--hover-background-active);
  transition: background-color .15s ease-in;
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
