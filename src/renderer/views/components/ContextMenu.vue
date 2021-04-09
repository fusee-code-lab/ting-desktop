<template>
  <div class="context-menu">
    <div class="context-menu-container">
      <div class="context-menu-header">
        <span class="context-menu-title">
          <p class="label">音乐平台</p>
        </span>
        <span class="context-menu-description">
          <p class="label">选择想要加载在 Ting 中的音乐平台</p>
        </span>
      </div>
      <div class="context-menu-body">
        <ul class="item-list">
          <li class="context-menu-item">
            <div class="menu-item-content">
              <span class="leading">
                <NeteasyMusicIcon/>
              </span>
              <span class="center">网易云音乐</span>
              <span class="trailing">
                <CheckIcon/>
              </span>
            </div>
          </li>
          <li class="context-menu-item">
            <div class="menu-item-content">
              <span class="leading">
                <QqmusicIcon/>
              </span>
              <span class="center">QQ 音乐</span>
              <span class="trailing">
                <CheckIcon/>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NeteasyMusicIcon from "../components/Icons/NeteasymusicIcon.vue";
import QqmusicIcon from "../components/Icons/QqmusicIcon.vue";
import CheckIcon from "../components/Icons/CheckIcon.vue";

export default defineComponent({
  name: "context-menu",
  components: { NeteasyMusicIcon, QqmusicIcon, CheckIcon },
  setup: () => {},
});
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}

@mixin context-menu-item {
  padding: 20px;
  transition: all 0.1s ease-in-out;
  border-radius: 4px;

  &:hover {
    transition: all 0.05s ease-in-out;
    background: rgba(118, 118, 128, 0.12);
  }

  &:active {
    transition: all 0.03s ease-in-out;
    background: rgba(246, 246, 246, 0.84);
    background: rgba(0, 0, 0, 0.1);
  }

  > .menu-item-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding-right: 20px;
  }

  .leading {
    width: 16px;
    height: 100%;
  }

  .center {
    padding-left: 18px;
    flex: 1;

    font-family: PingFangSC-Regular;
    font-size: 26px;
    color: rgba(0, 0, 0, 0.85);
  }

  .trailing {
    width: 16px;
    height: 100%;

    img {
      width: 16px;
      height: 11px;
    }
  }
}

.context-menu {
  * {
    user-select: none;
  }

  width: 400px;
  /* background-color: greenyellow; */
  border-radius: 4px;
  background: #F7F7FA;
  box-shadow: 0 0 14px -6px rgba(0, 0, 0, 0.29);

  > .context-menu-container {
    /* background-color: cyan; */
  }

  .context-menu-header {
    padding: 20px 20px 0 20px;
    margin-right: 20px;

    > .context-menu-title {
      font-family: PingFangSC-Semibold;
      font-size: 26px;
      color: #3B78D6;
    }

    > .context-menu-description {
      font-family: PingFangSC-Regular;
      font-size: 22px;
      color: rgba(0, 0, 0, 0.5);

      margin-top: 4px;
    }
  }

  .context-menu-body {
    > .item-list li {
      list-style: none;
    }

    > .item-list > .context-menu-item {
      @include context-menu-item;
    }
  }
}
</style>

