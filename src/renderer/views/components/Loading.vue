<template>
  <div class="loading-info">
    Loading
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "Loading",
  setup() {

  }
});
</script>

<style lang="scss" scoped>
.loading-info {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 10px;
}
</style>