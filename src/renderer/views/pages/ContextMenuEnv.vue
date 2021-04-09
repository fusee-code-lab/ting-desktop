<template>
  <div
    class="context-env"
    @contextmenu="rightClick"
    @mousemove="mouseMove"
    @click="leftClick"
  ></div>
  <ContextMenu
    class="context-menu"
    :style="{ left: position.left, top: position.top, opacity: opacity }"
  />
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/runtime-core';
import ContextMenu from '../components/ContextMenu.vue';

export default defineComponent({
  name: 'context-menu-env',
  components: { ContextMenu },
  setup: () => {
    const position = reactive({
      top: 0 + 'px',
      left: 0 + 'px'
    });
    const show = ref(false);
    const opacity = computed(() => {
      return show.value ? '1' : '0';
    });

    window.ipcFun.on('show-context-menu', (event, args) => {
      position.top = args.top + 'px';
      position.left = args.left + 'px';
      show.value = true;
    });

    window.ipcFun.on('hide-context-menu', (event, args) => {
      show.value = false;
      position.top = '0px';
      position.left = '0px';
    });

    const rightClick = (e: MouseEvent) => {
      window.ipcFun.send('mouse-right-click', { x: e.x, y: e.y });
    };

    const leftClick = (e: MouseEvent) => {
      window.ipcFun.send('mouse-left-click', { x: e.x, y: e.y });
    };

    const mouseMove = (e: MouseEvent) => {
      window.ipcFun.send('mouse-move', { x: e.x, y: e.y });
    };

    return { position, show, opacity, rightClick, mouseMove, leftClick };
  }
});
</script>

<style scoled lang="scss">
.context-env {
  width: 100vw;
  height: 100vh;
  background-color: white;
  opacity: 0.01;
}

.context-menu {
  position: absolute;
  opacity: 1;
}
</style>
