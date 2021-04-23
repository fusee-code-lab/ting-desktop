<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="keepAliveOpt.include" :exclude="keepAliveOpt.exclude" :max="keepAliveOpt.max">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
<script lang="ts">
import { useRouter } from 'vue-router';
import { argsData, keepAliveOpt } from './store';
import { tingCfgData } from '@/renderer/core';

export default {
  setup() {
    if (argsData.window.route) useRouter().replace(argsData.window.route);
    else if (!tingCfgData.first) useRouter().replace('/main');
    return { keepAliveOpt };
  }
};
</script>
<style lang="scss">
@import 'views/scss/color';
@import 'views/scss/main';
</style>
