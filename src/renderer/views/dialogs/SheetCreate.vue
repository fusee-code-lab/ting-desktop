<template>
  <div class="container">
    <div class="info drag">
      <div class="head">创建歌单</div>
      <div class="content">
        <div class="title">起个响亮的名字</div>
        <input v-model.trim="formData.name" placeholder="歌单名称" />
      </div>
      <div class="buts">
        <button @click="close()">取消</button>
        <button class="confirm" @click="send()">确定</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRaw } from 'vue';
import { isNull } from '@/utils';
import { SheetOpt } from '@/renderer/core';
import { windowClose, windowShow, windowMessageSend } from '@/renderer/common/window';

export default defineComponent({
  name: 'SheetCreate',
  setup() {
    // TODO  输入框部分未完成

    const formData = reactive<SheetOpt>({
      name: ''
    });

    function close() {
      windowClose();
    }

    function send() {
      //为主窗口发送消息
      if (isNull(formData.name)) return;
      windowMessageSend('sheet-create', {
        value: toRaw(formData)
      });
      close();
    }

    onMounted(() => {
      windowShow();
    });

    return {
      formData,
      close,
      send
    };
  }
});
</script>
<style lang="scss" scoped>
.info {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px;
  background-color: var(--white);

  > .head {
    height: 24px;
    font: normal 20px/24px segoe-ui;
  }

  > .content {
    height: calc(100% - 24px - 36px);
    display: flex;
    flex-direction: column;
    justify-content: center;

    > .title {
      font: normal 14px/20px segoe-ui;
    }
  }

  > .buts {
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    > button {
      width: 49%;
    }

    > .confirm {
      background-color: var(--theme-blue);
      color: var(--white);
    }
  }
}
</style>
