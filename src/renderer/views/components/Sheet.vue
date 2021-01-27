<style lang="scss" scoped>
@import "~@/renderer/views/scss/mixin.scss";

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
            @include device-pixel("~@/renderer/assets/icons/play_list_icon");
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
          content: "";
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

<template>
  <div class="sheet-info">
    <div class="items">
      <div class="title">歌单</div>
      <div class="content">
        <div class="item"

             v-for="sheet in audioSheetListData.list">
          <div class="left">
            <div class="icon bg-img"></div>
            <div class="text">{{ sheet.detail.name }}</div>
          </div>
        </div>
      </div>
      <div class="add" @click="addSheet">
        创建歌单
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, watch, toRaw, onMounted} from "vue";
import {audioSheetListData} from "@/renderer/core";
import {sheetList, sheetCreate} from "@/renderer/core/sheet";
import {createWindow} from "@/renderer/utils/window"
import {argsData, messageData} from "@/renderer/store";

export default defineComponent({
  name: "Sheet",
  setup() {

    watch(() => messageData["sheet-create"], async (n) => {
      console.log(n);
      try {
        const data = toRaw(n);
        let sheetNames = audioSheetListData.list.map(e => e.detail.name);
        console.log(sheetNames.indexOf(data.name))
        if (sheetNames.indexOf(data.name) === -1) {
          await sheetCreate(data.name, data);
          await sheetList();
        }
      } catch (e) {
        console.log(e);
      }
    });

    function addSheet() {
      createWindow({
        title: "歌单添加",
        route: "/sheetCreate",
        parentId: argsData.window.id,
        width: 400,
        height: 150,
        modal: true
      });
    }

    onMounted(async () => {
      await sheetList()
    })

    return {
      audioSheetListData,
      addSheet
    };
  }
});
</script>
