<template>
  <div class="sheet-info">
    <div v-if="data.info" class="head">
      <div class="left">
        <div
          class="icon bg-img"
          :style="{ 'background-image': 'url(' + data.info.detail.cover + ')' }"
        ></div>
      </div>
      <div class="right">
        <div class="title">
          <div class="name">{{ data.info.detail.name }}</div>
          <div class="vice">
            <span>{{ data.info.detail.count }}个</span>
            <span>{{ data.info.detail.tags.join('/') }}</span>
          </div>
          <div class="desc">
            <div class="text" :class="{ hide: !data.isDesc, show: data.isDesc }">
              {{ data.info.detail.desc }}
            </div>
            <div v-if="!data.isDesc" @click="showHide()" class="more">更多</div>
          </div>
          <div class="creat" :class="{ 'desc-show': data.isDesc }">
            <div class="icon bg-img" :class="data.vendor"></div>
            <a class="nickname" @click="openUrl(data.info.detail.userLink)">
              @{{ data.info.detail.creat_name }}
            </a>
          </div>
          <div class="buts">
            <button class="all-play" @click="playAll()">播放全部</button>
            <button class="add-sheet" @click="addSongAllSheet()">添加</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="data.info" class="content">
      <div class="head">
        <div>歌曲</div>
        <div>艺人</div>
        <div>专辑</div>
        <div>时长</div>
      </div>

      <div class="songs">
        <div class="item" v-for="song in data.info.songs" v-bind:key="song.id" @click="play(song)">
          <div>
            <div
              v-if="data.vendor === 'netease'"
              class="icon bg-img"
              :style="{ '--coverUrl': 'url(' + song.album.cover + '?param=28y28)' }"
            ></div>
            <div
              v-else
              class="icon bg-img"
              :style="{ '--coverUrl': 'url(' + song.album.cover + ')' }"
            ></div>
            <div class="name">{{ song.name }}</div>
          </div>
          <div>{{ song.artists.map((e) => e.name).join() }}</div>
          <div>{{ song.album.name }}</div>
          <div>
            {{
              Math.floor(song.songTime / 60) +
              ':' +
              ((song.songTime % 60) / 100).toFixed(2).slice(-2)
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue';
import { getPlaylistDetail, getSongUrl, Vendors } from '@/renderer/core/musicapi';
import { audio } from '@/renderer/core/audio';
import { audioPlayListData, sheetData, TingPlayListOpt } from '@/renderer/core';
import { openUrl } from '@youliso/electronic/ipc';

interface SheetDetailsOpt {
  info?: any;
  isDesc?: boolean;
  songTime?: string;
  vendor?: Vendors;
}

export default defineComponent({
  name: 'SheetDetails',
  setup() {
    const data = reactive<SheetDetailsOpt | null>({});

    onMounted(async () => {
      data.vendor = sheetData.value.vendor || null;
      let req = await getPlaylistDetail(
        sheetData.value.vendor,
        sheetData.value.id || sheetData.value.dissid,
        1,
        10
      );
      if (req.status) {
        console.log(req.data);
        data.info = req.data;
      }
    });

    function showHide() {
      data.isDesc = !data.isDesc;
    }

    async function play(item: any) {
      let req = await getSongUrl(item.vendor, item.id);
      if (req)
        await audio.play({
          id: item.id,
          vendor: item.vendor,
          path: req.url,
          name: item.name,
          cover: item.album.cover,
          singer: item.artists.map((e: any) => e.name).toString()
        });
    }

    async function playAll() {
      let songs: TingPlayListOpt = {};
      data.info.song_all.forEach((e: any) => (songs[`${e.vendor}|${e.id}`] = e));
      audioPlayListData.value = songs;
      await audio.load();
    }

    async function addSongAllSheet() {
      // TODO 添加所有歌曲至 歌单
    }

    return {
      data,
      showHide,
      play,
      playAll,
      addSongAllSheet,
      openUrl
    };
  }
});
</script>
<style lang="scss" scoped>
@import '@/renderer/views/scss/mixin.scss';

.sheet-info {
  padding: 40px 50px 10px;
  height: calc(100% - 50px);
  overflow: hidden;
  overflow-y: overlay;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    content: '';
    background-image: linear-gradient(var(--white) 60%, transparent 100%);
  }

  > .head {
    display: flex;

    > .left {
      width: 185px;
      height: 185px;
      margin-right: 20px;

      > .icon {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }

    > .right {
      width: calc(100% - 205px);
      height: 185px;

      > .title {
        > .name {
          @include text-overflow(1);
          height: 28px;
          width: 100%;
          font: normal 24px/28px ping-fing;
          color: var(--label);
        }

        > .vice {
          @include text-overflow(1);
          margin: 5px 0 15px;
          height: 14px;
          width: 100%;
          font: normal 12px/14px ping-fing;
          color: var(--secondary-label);

          > span {
            margin-left: 5px;

            &:nth-child(1) {
              margin-left: 0;
            }
          }
        }

        > .desc {
          display: flex;
          align-items: flex-end;

          > .text {
            font: normal 13px/16px ping-fang;
            color: var(--secondary-label);
            resize: none;
            outline: none;
            border: none;
            width: 200px;
            height: 50px;
          }

          > .hide {
            @include text-overflow(3);
            white-space: pre-line;
          }

          > .show {
            white-space: pre-line;
            overflow: hidden;
            overflow-y: overlay;
            width: 100%;
            height: 60px;
          }

          > .more {
            color: var(--theme-blue);
            font: 600 12px/14px ping-fang;
          }
        }

        > .creat.desc-show {
          margin: 5px 0 2px;
        }

        > .creat {
          margin: 15px 0 2px;
          height: 15px;
          display: flex;
          align-items: center;

          > .icon {
            width: 14px;
            height: 14px;
            margin-right: 5px;
          }

          > .icon.netease {
            @include device-pixel('@/assets/icons/netease_music');
          }

          > .icon.qq {
            @include device-pixel('@/assets/icons/qq_music');
          }

          > .nickname {
            font: normal 12px/14px segoe-ui;
            color: var(--theme-blue);
            text-decoration: underline;
            cursor: default;
          }
        }

        > .buts {
          height: 41px;
          display: flex;
          flex-shrink: 0;
          align-items: flex-end;

          > button {
            height: 30px;
            border-radius: 3px;
            margin-right: 16px;

            &:last-child {
              margin-right: 0;
            }
          }

          > .all-play {
            background-color: var(--theme-blue);
            color: var(--white);
          }

          > .add-sheet {
            background-color: var(--white);
          }
        }
      }
    }
  }

  > .content {
    > .head {
      padding: 20px 20px 5px;
      display: flex;
      align-items: center;

      > div {
        color: var(--secondary-label);
        font: 400 14px/20px ping-fang;

        &:nth-child(1) {
          width: 40%;
        }

        &:nth-child(2) {
          width: 25%;
        }

        &:nth-child(3) {
          width: 25%;
        }

        &:nth-child(4) {
          width: 10%;
          text-align: right;
        }
      }
    }

    > .songs {
      > .item {
        display: flex;
        align-items: center;
        height: 43px;
        border-radius: 5px;
        padding: 0 20px;

        &:nth-child(2n + 1) {
          background-color: #f6f6f6;
        }

        > div {
          @include text-overflow(1);
          color: var(--tertiary-label);
          font: 400 14px/20px ping-fang;

          &:nth-child(1) {
            display: flex;
            flex-shrink: 0;
            align-items: center;
            width: 40%;

            > .icon {
              width: 28px;
              height: 28px;
              margin-right: 10px;
              border-radius: 3px;
              background-image: var(--coverUrl);
            }

            > .name {
              @include text-overflow(1);
              width: calc(100% - 38px);
              color: var(--label);
            }
          }

          &:nth-child(2) {
            width: 25%;
          }

          &:nth-child(3) {
            width: 25%;
          }

          &:nth-child(4) {
            width: 10%;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
