<style lang="scss" scoped>
.info {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 32px 10px 0;
}
</style>

<template>
  <div class="container" :class="platform" :style="{'--accentColor':'#'+accentColor}">
    <Head/>
    <div class="info">
      <input v-model.trim="formData.name" placeholder="歌单名称"/>
      <button @click="send()">确定</button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRaw} from "vue";
import {getGlobal} from "@/lib";
import {messageSend, closeWindow} from "@/renderer/utils";
import {IPC_MSG_TYPE} from "@/lib/interface";
import Head from "@/renderer/views/components/Head.vue";
import {SheetOpt} from "@/core"
import {argsState} from "@/renderer/store";

export default defineComponent({
  name: "SheetCreate",
  components: {Head},
  setup() {
    const args = argsState();

    const formData = reactive<SheetOpt>({
      name: ""
    })

    function send() {//为主窗口发送消息
      messageSend({
        type: IPC_MSG_TYPE.WIN,
        key: "sheet-create",
        value: toRaw(formData)
      });
      closeWindow(args.id);
    }

    return {
      platform: getGlobal("platform"),
      accentColor: getGlobal("appInfo")["accentColor"],
      formData,
      send
    }
  }
})
</script>