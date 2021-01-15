<style lang="scss" scoped>
@import "~@/renderer/views/scss/mixin.scss";

.sheet-info {
  padding: 40px 50px 10px;
  height: calc(100% - 50px);
  overflow: hidden;
  overflow-y: overlay;

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
            margin-left: 14px;

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
            @include device-pixel("~@/renderer/assets/icons/neteasy music icon");
            width: 14px;
            height: 14px;
            margin-right: 5px;
          }

          > .icon.qq {
            @include device-pixel("~@/renderer/assets/icons/qq music icon");
          }

          > .nickname {
            font: normal 12px/14px segoe-ui;
            color: var(--theme-blue);
            text-decoration: underline;
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

        &:nth-child(2n+1) {
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

<template>
  <div class="sheet-info">

    <div v-if="data.info" class="head">
      <div class="left">
        <div class="icon bg-img" :style="{'background-image': 'url('+data.info.detail.cover+')'}"></div>
      </div>
      <div class="right">
        <div class="title">
          <div class="name">{{ data.info.detail.name }}</div>
          <div class="vice">
            <span>{{ data.info.songs.length }}个 · {{ data.songTime }}分钟</span>
            <span>{{ data.info.detail.tags.join("/") }}</span>
          </div>
          <div class="desc">
            <div class="text" :class="{'hide':!data.isShow,'show':data.isShow}">{{ data.info.detail.desc }}</div>
            <div v-if="!data.isShow" @click="showHide()" class="more cursor-pointer">更多</div>
          </div>
          <div class="creat" :class="{'desc-show':data.isShow}">
            <div class="icon bg-img" :class="{'qq':data.vendor === 'qq'}"></div>
            <div class="nickname">@{{ data.info.detail.creat_name }}</div>
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

        <div class="item" v-for="(song) in data.info.songs" v-bind:key="song.id"
             @click="play(song)">
          <div>
            <div v-if="data.vendor==='netease'" class="icon bg-img"
                 :style="{'--coverUrl':'url('+song.album.cover+'?param=28y28)'}"></div>
            <div v-else class="icon bg-img"
                 :style="{'--coverUrl':'url('+song.album.cover+')'}"></div>
            <div class="name">{{ song.name }}</div>
          </div>
          <div>{{ song.artists.map(e => e.name).join() }}</div>
          <div>{{ song.album.name }}</div>
          <div>{{ Math.floor(song.songTime / 60) + ":" + (song.songTime % 60 / 100).toFixed(2).slice(-2) }}</div>
        </div>

      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive} from "vue";
import {Vendors} from "@/core/musicapi/api";
import {getPlaylistDetail, getSongUrl} from "@/core/musicapi";
import Log from "@/lib/log";
import {audio} from "@/core/audio";
import {sheetCreate} from "@/core/sheet";
import {SongOpt, audioPlayListData, SheetOpt} from "@/core";

export default defineComponent({
  name: "Sheet",
  setup() {
    const data = reactive({
      info: null,
      isShow: false,
      songTime: "-",
      vendor: Vendors.netease
    });

    //"netease", 5382136003  "qq", 6970813620
    onMounted(async () => {
      let req = await getPlaylistDetail(Vendors.netease, 5382136003);
      console.log(req);
      if (req.status) {
        data.info = req.data;
        try {
          let songTime = 0;
          data.info.songs.map((e: any) => songTime += e.songTime);
          data.songTime = (songTime / 60).toFixed(0);
        } catch (e) {
          Log.error("[Sheet-onMounted]", e);
        }
      }
    })

    function showHide() {
      data.isShow = !data.isShow;
    }


    async function play(item: any) {
      let req = await getSongUrl(item.vendor, item.id);
      if (req) await audio.play({
        id: item.id,
        vendor: item.vendor,
        path: req.url,
        name: item.name,
        cover: item.album.cover,
        singer: item.artists.map((e: any) => e.name).toString()
      });
    }

    async function playAll() {
      let songs: { [key: string]: SongOpt } = {};
      data.info.songs.forEach((e: any) => songs[`${e.vendor}|${e.id}`] = {
        id: e.id,
        vendor: e.vendor,
        name: e.name,
        cover: e.album.cover,
        singer: e.artists.map((e: any) => e.name).toString()
      });
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
      addSongAllSheet
    }
  }
});
</script>
