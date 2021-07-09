<template>
  <router-view v-slot="{ Component }">
    <keep-alive
      :include="keepAliveData.include"
      :exclude="keepAliveData.exclude"
      :max="keepAliveData.max"
    >
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
<script lang="ts">
import { useRouter } from 'vue-router';
import { argsData, keepAliveData } from './store';
import { tingCfgData } from '@/renderer/core';

export default {
  setup() {
    const router = useRouter();
    if (tingCfgData.first) router.replace('/');
    //首次加载
    else router.replace(argsData.window.route || '/main');
    return { keepAliveData };
  }
};
</script>
<style lang="scss">
@import 'views/scss/color';
@import 'views/scss/main';
</style>
