<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="include" :exclude="exclude" :max="max">
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>
<script lang="ts">
import {toRefs} from "vue";
import {useRouter} from "vue-router";
import {argsState, keepAliveOpt} from "./store";
import {tingCfgData} from "@/renderer/core";

export default {
  setup() {
    const args = argsState();
    if (args.route) useRouter().replace(args.route);
    else if (!tingCfgData.first) useRouter().replace("/home");
    return {...toRefs(keepAliveOpt)};
  }
}
</script>
<style lang="scss">
@import "views/scss/main";
</style>
