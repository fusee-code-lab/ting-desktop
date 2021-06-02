<template>
  <div class="sheet-info">
    <div class="items">
      <div class="title">歌单</div>
      <div class="content">
        <div class="item" v-for="(sheet, index) in audioSheetListData.list" :key="index">
          <div class="left">
            <div class="icon bg-img"></div>
            <div class="text">{{ sheet.detail.name }}</div>
          </div>
        </div>
      </div>
      <div class="add" @click="addSheet">创建歌单</div>
    </div>
  </div>
</template>

<script lang="ts">
import { IpcRendererEvent } from 'electron';
import { defineComponent, toRaw, onMounted, onUnmounted } from 'vue';
import { audioSheetListData } from '@/renderer/core';
import { sheetList, sheetCreate } from '@/renderer/core/sheet';
import { windowCreate, windowMessageOn, windowMessageRemove } from '@/renderer/utils/window';
import { argsData } from '@/renderer/store';
import { getGlobal } from '@/renderer/utils';

export default defineComponent({
  name: 'Sheet',
  setup() {
    windowMessageOn('sheet-create', async (event: IpcRendererEvent, args: any) => {
      try {
        const data = toRaw(args.value);
        let sheetNames = audioSheetListData.list.map((e) => e.detail.name);
        console.log(sheetNames.indexOf(data.name));
        if (sheetNames.indexOf(data.name) === -1) {
          await sheetCreate(data.name, data);
          await sheetList();
        }
      } catch (e) {
        console.log(e);
      }
    });

    // TODO macos 下的 modal 高度有问题，目前仅仅加上 titleBar 的高度
    const isMacintosh = getGlobal('system.platform') === 'darwin';
    const isBigSurOrLatter =
      isMacintosh && parseInt(getGlobal('system.version').split('.')[0]) >= 11;
    const topTitleBarHeight = isBigSurOrLatter ? 28 : 22;

    function addSheet() {
      windowCreate({
        title: '歌单添加',
        route: '/sheetCreate',
        parentId: argsData.window.id,
        width: 400,
        height: isMacintosh ? topTitleBarHeight + 180 : 180,
        modal: true
      });
    }

    onMounted(async () => {
      await sheetList();
    });

    onUnmounted(() => {
      windowMessageRemove('sheet-create');
    });

    return {
      audioSheetListData,
      addSheet
    };
  }
});
</script>
<style lang="scss" scoped>
@import '~@/renderer/views/scss/mixin.scss';

.sheet-info {
  > .items {
    > .title {
      padding: 10px 0;
      color: var(--tertiary-label);
      font: normal 12px/12px ping-fang;
    }

    > .content {
      > .item {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        height: 20px;

        > .left {
          width: 90%;
          display: flex;
          align-items: center;

          > .icon {
            @include device-pixel('~@/renderer/assets/icons/play_list_icon');
            width: 16px;
            height: 16px;
            margin-right: 12px;
          }

          > .text {
            @include text-overflow(1);
            width: calc(100% - 28px);
            color: var(--label);
            font: normal 14px segoe-ui;
          }
        }

        > .right {
          width: 10%;
        }
      }

      > .item.act {
        &:before {
          content: '';
          position: absolute;
          left: -10px;
          height: 20px;
          width: 4px;
          background-color: var(--theme-blue);
        }
      }
    }

    > .add {
      color: var(--theme-blue);
      font: normal 12px/16px segoe-ui;
    }
  }
}
</style>
