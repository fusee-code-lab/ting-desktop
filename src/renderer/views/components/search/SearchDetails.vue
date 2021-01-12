<style lang="scss" scoped>
@import "~@/renderer/views/scss/mixin.scss";

.Search-details-info {
  padding: 0 20px;
  width: 100%;
  height: calc(100% - 60px);
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
      grid-gap: 25px 25px;
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
  }
}
</style>

<template>
  <div class="Search-details-info no-drag">
    <div class="title">
      <div class="song-name">“{{ searchData.keyword }}”</div>
      <div class="suffix">的搜索结果</div>
    </div>
    <div class="single">
      <div class="title">
        <div class="text">单曲</div>
        <div class="suffix">更多</div>
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
    </div>
    <div class="sheet">
      <div class="title">
        <div class="text">歌单</div>
      </div>
      <div class="content">
        <div class="item" v-for="item in searchData.sheetData.sheets" v-bind:key="item.id"
             @click="play(item)">
          <img v-if="item.vendor==='netease'" :src="item.coverImgUrl+'?param=120y120'"
               alt="">
          <img v-else :src="item.imgurl">
          <div class="title">{{ item.name || item.dissname }}</div>
          <div class="subtitle">{{ item.description || item.introduction }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {searchData} from "@/core";
import {getSongUrl} from "@/core/music";
import {audio} from "@/core/audio";

export default defineComponent({
  name: "SearchDetails",
  setup() {

    async function play(item: any) {
      let req = await getSongUrl(item.vendor, item.id);
      if (req) await audio.play({
        vendor: item.vendor,
        path: req.url,
        name: item.name,
        cover: item.album.cover,
        singer: item.artists.map((e: any) => e.name).toString()
      });
    }

    return {
      searchData,
      play
    }
  }
})
</script>