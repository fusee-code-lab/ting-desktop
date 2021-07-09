<template>
  <div class="container bg-img drag">
    <Head />
    <div class="main">
      <div class="content">
        <img src="~@/lib/assets/logo.png" alt="logo" />
        <div class="title">
          欢迎来到
          <span style="margin-left: 10px">Ting</span>
        </div>
        <button class="but" @click="handleJumpHome()">开始</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRaw } from 'vue';
import { windowSetSize, windowCreate, windowShow } from '@/renderer/utils/window';
import Head from '@/renderer/views/components/Head.vue';
import { argsData } from '@/renderer/store';
import { tingCfgData } from '@/renderer/core';
import { dirname, normalize } from '@/renderer/utils/path';
import { writeFile, access, mkdir } from '@/renderer/utils/file';
import { sendGlobal, getAppPath } from '@/renderer/utils';

export default defineComponent({
  name: 'Welcome',
  components: {
    Head
  },
  setup() {
    windowSetSize(argsData.window.id, [800, 600]);

    const handleJumpHome = async () => {
      const filePath = getAppPath('userData') + '/cfg/index.json';
      const dirPath = dirname(filePath);
      let cfgData = toRaw(tingCfgData);
      cfgData.first = false;
      sendGlobal('setting.cfg', cfgData);
      if (!(await access(dirPath))) await mkdir(dirPath);
      writeFile(filePath, JSON.stringify(cfgData)).then(() => {
        windowCreate({
          customize: {
            isMainWin: true,
            route: '/main'
          },
          resizable: true
        });
      });
    };

    onMounted(() => {
      windowShow(argsData.window.id);
    });

    return {
      handleJumpHome
    };
  }
});
</script>
<style lang="scss" scoped>
.win32,
.linux {
  .container > .main {
    right: 0;

    > .content {
      align-items: flex-end;
      padding-right: 60px;

      > .title {
        text-align: right;
      }
    }
  }
}

.darwin {
  .container > .main {
    left: 0;

    > .content {
      align-items: flex-start;
      padding-left: 60px;

      > .title {
        text-align: left;
      }
    }
  }
}

.container {
  position: relative;
  background-image: url('~@/lib/assets/rocket.png');

  > .main {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 380px;
    background-color: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    justify-content: center;

    > .content {
      display: flex;
      flex-direction: column;
      justify-content: center;

      > img {
        width: 20%;
      }

      > .title {
        margin-top: 17px;
        height: 41px;
        font: bold 40px/40px ping-fang;
        letter-spacing: 1px;
        color: var(--theme-blue);
      }

      > .but {
        margin-top: 35px;
        width: 120px;
        height: 32px;
        background-color: var(--theme-blue);
        outline: none;
        color: var(--white);
        font: 600 17px/32px segoe-ui;
      }
    }
  }
}
</style>
