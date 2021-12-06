<template>
  <div class="setting-page">
    <div class="head">
      <div class="title">设置</div>
    </div>
    <div class="item">
      <div class="title">下载路径</div>
      <div class="content">
        <div class="path">{{ tingCfgData.down }}</div>
        <button class="but" @click="revise('down')">选择</button>
      </div>
    </div>
    <div class="item">
      <div class="title">歌单路径</div>
      <div class="content">
        <div class="path">{{ tingCfgData.sheet }}</div>
        <button class="but" @click="revise('sheet')">选择</button>
      </div>
    </div>
    <div class="item">
      <div class="title">播放质量</div>
      <div class="content">
        <div class="buts">
          <button class="but" :class="{ act: tingCfgData.br === 192 }" @click="setBr(192)">
            低
          </button>
          <div class="separator"></div>
          <button class="but" :class="{ act: tingCfgData.br === 320 }" @click="setBr(320)">
            中
          </button>
          <div class="separator"></div>
          <button class="but" :class="{ act: tingCfgData.br === 999 }" @click="setBr(999)">
            高
          </button>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="title">
        关于
        <div class="app-name">Ting</div>
      </div>
      <div class="content">
        <div class="text">
          <div class="txt">当前版本 {{ version }}</div>
          <div class="txt">由 fusee-code-lab 开发</div>
          <div class="buts">
            <button class="but link">链接</button>
            <button class="but github">github</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { tingCfgData } from '@/renderer/core/index';
import { openDialog } from '@/renderer/common/dialog';
import { getGlobal } from '@/renderer/common';
export default defineComponent({
  name: 'Setting',
  setup() {
    const version = ref<string>('');
    getGlobal<string>('app.version').then((v) => (version.value = v));

    function revise(type: string) {
      openDialog({
        title: `选择【${type === 'down' ? '下载路径' : '歌单路径'}】目录`,
        properties: ['openDirectory']
      }).then((req) => {
        if (!req.canceled) {
          if (type === 'down') tingCfgData.down = req.filePaths[0];
          else if (type === 'sheet') tingCfgData.sheet = req.filePaths[0];
        }
      });
    }

    function setBr(br: number) {
      tingCfgData.br = br;
    }

    return {
      version,
      tingCfgData,
      revise,
      setBr
    };
  }
});
</script>
<style lang="scss" scoped>
@import '~@/renderer/views/scss/mixin.scss';
.setting-page {
  padding: 40px 20px 0;
  height: calc(100% - 50px);

  > .head {
    padding-bottom: 30px;
    > .title {
      font: bold 24px ping-fang;
      color: var(--theme-blue);
    }
  }

  > .item {
    padding-bottom: 20px;
    > .title {
      display: flex;
      align-items: center;
      font: bold 13px/13px ping-fang;
      padding-bottom: 10px;
      > .app-name {
        padding-left: 5px;
        color: var(--theme-blue);
      }
    }
    > .content {
      font: normal 12px/12px ping-fang;
      display: flex;
      align-items: center;
      > .text {
        position: relative;
        > .txt {
          padding-bottom: 7px;
        }
        > .buts {
          display: flex;
          align-items: center;
          > .but {
            border-radius: 3px;
            width: 56px;
            height: 20px;
            margin-right: 10px;
            font: normal 12px/12px ping-fang;
            &:last-child {
              margin-right: 0;
            }
          }
          > .but.link {
            background-color: var(--theme-blue);
            color: var(--white);
          }
          > .but.github {
            background-color: var(--black);
            color: var(--white);
          }
        }
      }
      > .path {
        @include text-overflow(1);
        background: rgba(0, 0, 0, 0.05);
        width: 260px;
        height: 24px;
        line-height: 24px;
        padding: 0 15px;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
      }
      > .but {
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        font: normal 12px/12px ping-fang;
        width: 50px;
        height: 24px;
        background-color: var(--theme-blue);
        color: var(--white);
      }
      > .buts {
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.05);
        padding: 1px 4px;
        display: flex;
        align-items: center;
        > .separator {
          margin: 0 2px;
          width: 1px;
          height: 8px;
          background-color: #8e8e93;
        }
        > .but {
          position: relative;
          border-radius: 3px;
          font: normal 12px/12px ping-fang;
          width: 90px;
          height: 24px;
        }
        > .but.act {
          background-color: var(--theme-blue);
          color: var(--white);
        }
      }
    }
  }
}
</style>
