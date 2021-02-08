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
import {defineComponent, onMounted, reactive, toRaw} from "vue";
import {isNull} from "@/lib";
import {messageSend} from "@/renderer/utils";
import {IPC_MSG_TYPE} from "@/lib/interface";
import Head from "@/renderer/views/components/Head.vue";
import {SheetOpt} from "@/renderer/core"
import {argsData} from "@/renderer/store";
import {windowClose, windowShow} from "@/renderer/utils/window";

export default defineComponent({
  name: "SheetCreate",
  components: {Head},
  setup() {

    const formData = reactive<SheetOpt>({
      name: ""
    })

    function send() {//为主窗口发送消息
      if (isNull(formData.name)) return;
      messageSend({
        type: IPC_MSG_TYPE.WIN,
        key: "sheet-create",
        value: toRaw(formData)
      });
      windowClose(argsData.window.id);
    }

    onMounted(() => {
      windowShow(argsData.window.id);
    })

    return {
      platform: argsData.window.platform,
      accentColor: argsData.window.appInfo.accentColor,
      formData,
      send
    }
  }
})
</script>
<style lang="scss" scoped>
.info {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 32px 10px 0;
}
</style>
