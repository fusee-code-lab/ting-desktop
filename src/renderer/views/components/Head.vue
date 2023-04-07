<template>
  <div class="head-info drag">
    <div @dblclick="maxMin" class="head-content">
      <div v-if="!isMacintosh" class="title">
        <span>{{ title }}</span>
      </div>
    </div>
    <div class="command-bar">
      <div class="leading">
        <HoverButton v-if="canBack" @click="back">
          <BackIcon />
        </HoverButton>
      </div>
      <div class="trailing">
        <div v-if="!isMacintosh" class="events">
          <div @click="minimize" class="event close no-drag">
            <MinimizeIcon />
          </div>
          <div @click="maximize" class="event close no-drag">
            <MaximizeIcon />
          </div>
          <div @click="close" class="event close no-drag">
            <CloseIcon />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  getGlobal,
  windowClose,
  windowHide,
  windowMax,
  windowMaxMin,
  windowMin
} from '@youliso/electronic/ipc';
import { audioData } from '@/renderer/core';
import CloseIcon from '@/renderer/views/components/Icons/CloseIcon.vue';
import MinimizeIcon from '@/renderer/views/components/Icons/MinimizeIcon.vue';
import MaximizeIcon from '@/renderer/views/components/Icons/MaximizeIcon.vue';
import BackIcon from '@/renderer/views/components/Icons/BackIcon.vue';
import HoverButton from '@/renderer/views/components/HoverButton.vue';

export default defineComponent({
  name: 'Head',
  components: {
    CloseIcon,
    MinimizeIcon,
    MaximizeIcon,
    HoverButton,
    BackIcon
  },
  setup() {
    const argsData = window.customize;
    const isMacintosh = ref(false);
    const title = ref(argsData.title);
    getGlobal<string>('system.platform').then(
      (platform) => (isMacintosh.value = platform === 'darwin')
    );
    getGlobal<string>('app.name').then((appNmae) => (title.value = appNmae));

    function close() {
      if (argsData.route === '/') windowClose();
      else windowHide();
    }

    function minimize() {
      windowMin();
    }

    function maximize() {
      windowMax();
    }

    function maxMin() {
      windowMaxMin();
    }

    const route = useRoute();
    const router = useRouter();

    const canBack = computed(() => {
      const inMain = route.path.startsWith('/main');
      const historyCount = window.history.length;
      return inMain && historyCount > 1;
    });

    function back() {
      router.back();
    }

    return {
      close,
      minimize,
      maximize,
      maxMin,
      canBack,
      isMacintosh,
      back,
      title,
      audioData
    };
  }
});
</script>

<style lang="scss">
@import '@/renderer/views/scss/mixin.scss';
@import '../scss/constants.scss';

.head-info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: $title-bar-height;
  z-index: z('head');
  display: flex;
  justify-content: space-between;
  align-items: center;

  > .head-content {
    height: 100%;
    display: flex;
    align-items: center;
    width: $sidebar-width;
    padding-left: 15px;

    > .title {
      font: normal 13px /13px ping-fang;
    }
  }

  > .command-bar {
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .leading {
      padding-left: 10px;
    }

    .trailing > .events {
      display: flex;
      justify-content: space-between;
      align-items: center;

      > .event {
        width: 40px;
        height: 100%;
        margin-left: 8px;
        text-align: center;

        > * {
          font-size: 10px !important;
        }
      }

      > .event:hover {
        opacity: 0.9;
      }

      > .event:active {
        opacity: 0.7;
      }

      > .normal {
        background-color: var(--theme-blue);
      }

      > .top {
        background-color: var(--theme-pink);
      }
    }
  }
}
</style>
