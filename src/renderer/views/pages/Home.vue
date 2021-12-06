<template>
  <div class="home" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  setup() {
    return {};
  }
});
</script>

<style lang="scss" scoped>
.home {
  text-align: center;
  font: 400 19px ping-fang;
  width: 100%;
  height: 100%;
  background-image: url('~@/assets/rocket.png');
  background-size: 150px 150px;
  background-repeat: no-repeat;
  background-position: center center;
  filter: grayscale(100%) hue-rotate(180deg) opacity(50%);
}
</style>
