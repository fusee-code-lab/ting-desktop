<style lang="scss" scoped>
@import "~@/renderer/views/scss/mixin.scss";

.Search-details-info {
  height: calc(100% - 50px);

  .header {
    padding-top: 40px;
    background-color: var(--background);

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
  }

  .section-header {
    padding-top: 20px;
    padding-left: 12px;
    background-color: var(--background);

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
  }

  .section-body {
    padding-left: 12px;
    > .content {
      display: grid;
      grid-template-columns: repeat(auto-fill, 120px);
      grid-auto-rows: 150px;
      grid-gap: 22px 22px;
      width: 100%;
      height: 100%;
      padding: 20px 0 10px;

      > .item:hover {
        > .cover {
          transform: scale(1.05) translateY(-5px);
          transition: all 0.2s ease-in-out;
        }

        > .cover > .img-cover {
          transition: all 0.2s ease-in-out;
          background-color: rgba($color: #333333, $alpha: 0.7); // TODO 使用颜色变量

          > .play-symbol {
            background-color: var(--white);
            transition: all 0.2s ease-in-out;
          }
        }
      }

      > .item > .cover > .img-cover > .play-symbol:hover {
        background-color: var(--theme-blue);
        transition: all 0.2s ease-in-out;
      }

      > .item {
        > .cover {
          width: 120px;
          height: 120px;
          border-radius: 2px;
          transition: all 0.1s ease-in-out;
          background-position: center;
          background-size: 100%;

          > .img-cover {
            width: 100%;
            height: 100%;
            position: relative;
            top: 0;
            left: 0;
            border-radius: 2px;
            transition: all 0.1s ease-in-out;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: transparent;

            > .play-symbol {
              width: 20px;
              height: 20px;
              background-color: transparent;
              transition: all 0.1s ease-in-out;
            }
          }
        }

        > .img-cover {
          position: relative;
          top: 0;
          left: 0;
          background-color: rebeccapurple;
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
    <EnhancedList
      :contentInsets="{ left: 20, right: 20, bottom: 10 }"
      :fixedHeader="true"
      :data="listData"
    >
      <template v-slot:header>
        <div :topInsets="40" class="header">
          <div class="title">
            <div class="song-name">“{{ searchData.keyword }}”</div>
            <div class="suffix">的搜索结果</div>
          </div>
        </div>
      </template>
      <template v-slot:section-header="{ section }">
        <div class="section-header">
          <div class="title">
            <div class="text">{{ section }}</div>
          </div>
        </div>
      </template>
      <template v-slot:item="{ item: searchRes }">
        <div class="section-body">
          <div class="content">
            <div
              class="item"
              v-for="item in searchRes.items"
              v-bind:key="item.id"
              @click="searchRes.clickItemAction(item)"
            >
              <div
                class="cover"
                :style="{ 'background-image': `url(${item.coverUrl})` }"
              >
                <div class="img-cover">
                  <i class="play-symbol"></i>
                </div>
              </div>
              <div class="title">{{ item.title }}</div>
              <div class="subtitle">{{ item.subtitle }}</div>
            </div>
          </div>
          <div
            v-if="searchRes.haveMore"
            class="suffix cursor-pointer"
            @click="searchRes.moreAction"
          >
            {{ searchRes.moreText }}
          </div>
        </div>
      </template>
    </EnhancedList>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import { searchData, sheetData } from "@/renderer/core";
import { getSongUrl, searchSheet, searchSong } from "@/lib/musicapi";
import { audio } from "@/renderer/core/audio";
import { componentShow, messageData, messageKeys } from "@/renderer/store";
import EnhancedList, {
  EnhancedListSection as Section,
} from "./EnhancedList.vue";

interface SearchResultItem {
  items: {
    id: string;
    coverUrl: string;
    title: string;
    subtitle: string;
  }[];
  qqTotal: number;
  neteaseTotal: number;
  offset: number;
  moreText: string;
  haveMore: boolean;
  moreAction: Function;
  clickItemAction: Function;
}

export default defineComponent({
  name: "SearchDetails",
  components: { EnhancedList },
  setup() {
    const data = reactive({
      isSongOf: true,
      isSongOfText: "加载更多",
      isSheetOf: true,
      isSheetOfText: "加载更多",
    });

    async function songOf() {
      searchData.singleData.offset += 1;
      data.isSongOfText = "加载中...";
      let req = (await searchSong(
        searchData.keyword,
        searchData.singleData.offset
      )) as any;
      data.isSongOfText = "加载更多";
      console.log("[songOf]", req);
      if (req && req.status && req.data.songs.length > 0) {
        searchData.singleData.songs.push(...req.data.songs);
      } else data.isSongOf = false;
    }

    async function sheetOf() {
      searchData.sheetData.offset += 1;
      data.isSheetOfText = "加载中...";
      let req = (await searchSheet(
        searchData.keyword,
        searchData.sheetData.offset
      )) as any;
      data.isSheetOfText = "加载更多";
      console.log("[sheetOf]", req);
      if (req && req.status && req.data.sheets.length > 0) {
        searchData.sheetData.sheets.push(...req.data.sheets);
      } else data.isSheetOf = false;
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
          singer: item.artists.map((e: any) => e.name).toString(),
        });
    }

    async function sheet(item: any) {
      sheetData.value = item;
      messageData[messageKeys.Show] = componentShow.SheetDetails;
    }

    // TODO 有些没有 cover 的音乐 。。。
    const listData = computed<Section<String, SearchResultItem>[]>(() => {
      return [
        {
          data: "单曲",
          item: {
            ...searchData.singleData,
            items: searchData.singleData.songs.map((i) => ({
              ...i,
              id: i.id,
              coverUrl:
                i.vendor === "netease"
                  ? `${i?.album?.cover}?param=120y120`
                  : `${i?.album?.cover}`,
              title: i.name,
              subtitle: i.artists.map((e: any) => e.name).join(),
            })),
            moreText: data.isSongOfText,
            haveMore: data.isSongOf,
            moreAction: songOf,
            clickItemAction: play,
          },
        },
        {
          data: "歌单",
          item: {
            ...searchData.sheetData,
            items: searchData.sheetData.sheets.map((i) => ({
              ...i,
              id: i.id,
              coverUrl:
                i.vendor === "netease"
                  ? `${i.coverImgUrl}?param=120y120`
                  : `${i.imgurl}`,
              title: i.name || i.dissname,
              subtitle: i.description || i.introduction,
            })),
            moreText: data.isSheetOfText,
            haveMore: data.isSheetOf,
            moreAction: sheetOf,
            clickItemAction: sheet,
          },
        },
      ];
    });
    console.log(listData.value[0].item.items);

    return {
      data,
      listData,
      searchData,
      play,
      sheet,
      songOf,
      sheetOf,
    };
  },
});
</script>
