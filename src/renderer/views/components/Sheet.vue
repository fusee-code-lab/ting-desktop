<style lang="scss" scoped>
@import "~@/renderer/views/scss/mixin.scss";

.sheet-info {
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
}
</style>

<template>
  <div class="sheet-info">
    <div class="title">常听</div>
    <div class="content">
      <div class="item" v-for="sheet in audioSheetListData">
        <div class="left">
          <div class="icon bg-img"></div>
          <div class="text">{{ sheet.detail.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {audioSheetListData} from "@/core";
import {sheetList} from "@/core/sheet";

export default defineComponent({
  name: "Sheet",
  setup() {

    sheetList();

    return {
      audioSheetListData
    };
  }
});
</script>