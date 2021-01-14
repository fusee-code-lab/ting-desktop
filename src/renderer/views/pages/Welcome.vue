<style lang="scss" scoped>
.container {
  position: relative;
  background-image: url('https://img.shuaxinjs.cn/apple.jpg');

  > .main {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 380px;
    background-color: rgba(255, 255, 255, .65);
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
      >.but{
        margin-top: 35px;
      }
    }

  }

  > .win32 {
    right: 0;

    > .content {
      align-items: flex-end;
      padding-right: 60px;

      > .title {
        text-align: right;
      }
    }
  }

  > .darwin {
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
</style>
<template>
  <div class="container bg-img" :class="platform">
    <Head/>
    <div class="main" :class="platform">
      <div class="content">
        <img src="https://img.shuaxinjs.cn/favicon-16x16-next.png" alt="logo"/>
        <div class="title">欢迎来到<span style="margin-left: 10px;">Ting</span></div>
        <Button class="but" @click="handleJumpHome" text="开始"/>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Button from '../components/Button.vue'
import {getGlobal} from "@/lib";
import {setMinSize, setSize, createWindow} from "@/renderer/utils";
import Head from "@/renderer/views/components/Head.vue";
import {argsState} from "@/renderer/store";

export default defineComponent({
  name: 'Welcome',
  components: {
    Head,
    Button,
  },
  setup() {
    const args = argsState();
    setMinSize(args.id,[800, 600]);
    setSize(args.id,[800, 600]);

    const handleJumpHome = () => {
      createWindow({
        isMainWin: true,
        resizable: true,
        route: "/home"
      })
    }

    return {
      handleJumpHome,
      platform: getGlobal("platform")
    }
  },
})
</script>