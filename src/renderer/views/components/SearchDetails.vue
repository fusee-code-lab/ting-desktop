<style lang="scss" scoped>
@import "~@/renderer/views/scss/mixin.scss";

.Search-details-info {
  padding: 40px 20px 10px;
  width: 100%;
  height: calc(100% - 50px);
  overflow: hidden;
  overflow-y: overlay;

  > .title {
    display: flex;
    align-items: center;
    font: bold 24px ping-fang;

    > .song-name {
      color: var(--theme-blue);
    }

    > .suffix {
      margin-left: 10px;
      color: var(--label);
    }
  }

  > .single, .sheet {
    padding: 20px 0 0 12px;

    > .title {
      display: flex;
      align-items: center;
      font: bold 20px ping-fang;

      > .suffix {
        margin-left: 10px;
        color: var(--theme-blue);
        font-size: 12px;
      }
    }


    > .content {
      display: grid;
      grid-template-columns: repeat(auto-fill, 120px);
      grid-auto-rows: 150px;
      grid-gap: 22px 22px;
      width: 100%;
      height: 100%;
      padding: 20px 0 10px;

      > .item {
        > img {
          width: 120px;
          height: 120px;
        }

        > .title {
          @include text-overflow(1);
          color: var(--label);
          font: normal 14px/16px ping-fang;
        }

        > .subtitle {
          @include text-overflow(1);
          color: var(--tertiary-label);
          font: normal 12px/14px ping-fang;
        }
      }
    }

    > .suffix {
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--theme-blue);
      font-size: 12px;
      height: 30px;
    }

  }
}
</style>

<template>
  <div class="Search-details-info">
    <div class="title">
      <div class="song-name">“{{ searchData.keyword }}”</div>
      <div class="suffix">的搜索结果</div>
    </div>
    <div class="single">
      <div class="title">
        <div class="text">单曲</div>
        <!--        <div v-if="data.isSongOf" class="suffix" @click="songOf()">更多</div>-->
      </div>
      <div class="content">
        <div class="item" v-for="item in searchData.singleData.songs" v-bind:key="item.id"
             @click="play(item)">
          <img v-if="item.vendor==='netease'" :src="item?.album?.cover+'?param=120y120'"
               alt="">
          <img v-else :src="item?.album?.cover">
          <div class="title">{{ item.name }}</div>
          <div class="subtitle">{{ item.artists.map(e => e.name).join() }}</div>
        </div>
      </div>
      <div v-if="data.isSongOf" class="suffix cursor-pointer" @click="songOf()">
        {{ data.isSongOfText }}
      </div>
    </div>
    <div class="sheet">
      <div class="title">
        <div class="text">歌单</div>
        <!--        <div v-if="data.isSheetOf" class="suffix" @click="sheetOf()">更多</div>-->
      </div>
      <div class="content">
        <div class="item" v-for="item in searchData.sheetData.sheets" v-bind:key="item.id"
             @click="sheet(item)">
          <img v-if="item.vendor==='netease'" :src="item.coverImgUrl+'?param=120y120'"
               alt="">
          <img v-else :src="item.imgurl">
          <div class="title">{{ item.name || item.dissname }}</div>
          <div class="subtitle">{{ item.description || item.introduction }}</div>
        </div>
      </div>
      <div v-if="data.isSheetOf" class="suffix cursor-pointer" @click="sheetOf()">
        {{ data.isSheetOfText }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";
import {searchData, sheetData} from "@/core";
import {getSongUrl, searchSheet, searchSong} from "@/core/musicapi";
import {audio} from "@/core/audio";
import {componentShow, messageData, messageKeys} from "@/renderer/store";

export default defineComponent({
  name: "SearchDetails",
  setup() {
    const data = reactive({
      isSongOf: true,
      isSongOfText: "加载更多",
      isSheetOf: true,
      isSheetOfText: "加载更多",
    })

    async function songOf() {
      searchData.singleData.offset += 1;
      data.isSongOfText = "加载中...";
      let req = await searchSong(searchData.keyword, searchData.singleData.offset) as any;
      data.isSongOfText = "加载更多";
      console.log("[songOf]", req)
      if (req && req.status && req.data.songs.length > 0) {
        searchData.singleData.songs.push(...req.data.songs);
      } else data.isSongOf = false;
    }

    async function sheetOf() {
      searchData.sheetData.offset += 1;
      data.isSheetOfText = "加载中...";
      let req = await searchSheet(searchData.keyword, searchData.sheetData.offset) as any;
      data.isSheetOfText = "加载更多";
      console.log("[sheetOf]", req)
      if (req && req.status && req.data.sheets.length > 0) {
        searchData.sheetData.sheets.push(...req.data.sheets);
      } else data.isSheetOf = false;
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

    async function sheet(item: any) {
      sheetData.value = item;
      messageData[messageKeys.Show] = componentShow.SheetDetails;
    }

    return {
      data,
      searchData,
      play,
      sheet,
      songOf,
      sheetOf
    }
  }
})
</script>