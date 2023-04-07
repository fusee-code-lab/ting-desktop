<template>
  <div class="container bg-img drag">
    <Head />
    <div class="main">
      <div class="content">
        <img src="@/assets/logo.png" alt="logo" />
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
import {
  windowCreate,
  windowShow,
  windowClose,
  dirname,
  writeFile,
  access,
  mkdir,
  sendGlobal,
  getAppPath
} from '@youliso/electronic/ipc';
import Head from '@/renderer/views/components/Head.vue';
import { tingCfgData } from '@/renderer/core';

export default defineComponent({
  name: 'Welcome',
  components: {
    Head
  },
  setup() {
    const handleJumpHome = async () => {
      const filePath = (await getAppPath('userData')) + '/cfg/index.json';
      const dirPath = await dirname(filePath);
      let cfgData = toRaw(tingCfgData);
      cfgData.first = false;
      sendGlobal('setting.cfg', cfgData);
      if (!(await access(dirPath))) await mkdir(dirPath);
      writeFile(filePath, JSON.stringify(cfgData)).then(() => {
        windowCreate(
          {
            isMainWin: true,
            route: '/main'
          },
          {
            backgroundColor: '#ffffff',
            frame: false,
            show: false,
            resizable: true
          }
        );
        windowClose();
      });
    };

    onMounted(() => {
      windowShow();
    });

    return {
      handleJumpHome
    };
  }
});
</script>
<style lang="scss" scoped>
[platform='win32'],
[platform='linux'] {
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

[platform='darwin'] {
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
  background-image: url('@/assets/rocket.png');

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
