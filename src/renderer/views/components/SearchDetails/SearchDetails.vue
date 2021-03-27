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
            <SongItem
              v-for="item in searchRes.items"
              v-bind:key="item.id"
              @click="searchRes.clickItemAction(item)"
              :song="item"
            />
          </div>
          <div v-if="searchRes.haveMore" class="suffix" @click="searchRes.moreAction">
            {{ searchRes.moreText }}
          </div>
        </div>
      </template>
    </EnhancedList>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import { searchData, sheetData } from '@/renderer/core';
import { getSongUrl, searchSheet, searchSong } from '@/lib/musicapi';
import { audio } from '@/renderer/core/audio';
import { componentShow, messageData, messageKeys } from '@/renderer/store';
import EnhancedList, { EnhancedListSection as Section } from './EnhancedList.vue';
import SongItem from './SongItem.vue';

export interface SearchResultSongItem {
  id: string;
  coverUrl: string;
  title: string;
  subtitle: string;
}

export interface SearchResultItem {
  items: SearchResultSongItem[];
  qqTotal: number;
  neteaseTotal: number;
  offset: number;
  moreText: string;
  haveMore: boolean;
  moreAction: Function;
  clickItemAction: Function;
}

export default defineComponent({
  name: 'SearchDetails',
  components: { EnhancedList, SongItem },
  setup() {
    const data = reactive({
      isSongOf: true,
      isSongOfText: '加载更多',
      isSheetOf: true,
      isSheetOfText: '加载更多'
    });

    // TODO 或许移动到别处是更好的选择
    function withTransition<Data>(promise: Promise<Data>, options: { timeoutMs: number }) {
      async function startTransition(fn: () => void, clearFn: (data: Data) => void) {
        const identifier = setTimeout(() => {
          fn();
        }, options.timeoutMs);

        const data = await promise;

        clearTimeout(identifier);

        clearFn(data);
      }

      return startTransition;
    }

    async function songOf() {
      searchData.singleData.offset += 1;

      // 500ms 后没加载出来再呈现加载状态
      const start = withTransition(searchSong(searchData.keyword, searchData.singleData.offset), {
        timeoutMs: 500
      });

      start(
        () => {
          data.isSongOfText = '加载中...';
        },
        (res) => {
          data.isSongOfText = '加载更多';
          console.log('[songOf]', res);
          if (res && res.status && res.data.songs.length > 0) {
            searchData.singleData.songs.push(...res.data.songs);
          } else data.isSongOf = false;
        }
      );
    }

    async function sheetOf() {
      searchData.sheetData.offset += 1;

      // 500ms 后没加载出来再呈现加载状态
      const start = withTransition(searchSheet(searchData.keyword, searchData.sheetData.offset), {
        timeoutMs: 500
      });

      start(
        () => {
          data.isSheetOfText = '加载中...';
        },
        (res) => {
          data.isSheetOfText = '加载更多';
          console.log('[sheetOf]', res);
          if (res && res.status && res.data.sheets.length > 0) {
            searchData.sheetData.sheets.push(...res.data.sheets);
          } else data.isSheetOf = false;
        }
      );
    }

    async function play(item: any) {
      let req = await getSongUrl(item.vendor, item.id);
      if (req)
        audio
          .play({
            id: item.id,
            vendor: item.vendor,
            path: req.url,
            name: item.name,
            cover: item.album.cover,
            singer: item.artists.map((e: any) => e.name).toString()
          })
          .catch(console.log);
    }

    async function sheet(item: any) {
      sheetData.value = item;
      messageData[messageKeys.Show] = componentShow.SheetDetails;
    }

    // TODO 有些没有 cover 的音乐 。。。
    const listData = computed<Section<String, SearchResultItem>[]>(() => {
      return [
        {
          data: '单曲',
          item: {
            ...searchData.singleData,
            items: searchData.singleData.songs.map((i) => ({
              ...i,
              id: i.id,
              coverUrl:
                i.vendor === 'netease' ? `${i?.album?.cover}?param=120y120` : `${i?.album?.cover}`,
              title: i.name,
              subtitle: i.artists.map((e: any) => e.name).join()
            })),
            moreText: data.isSongOfText,
            haveMore: data.isSongOf,
            moreAction: songOf,
            clickItemAction: play
          }
        },
        {
          data: '歌单',
          item: {
            ...searchData.sheetData,
            items: searchData.sheetData.sheets.map((i) => ({
              ...i,
              id: i.id,
              coverUrl: i.vendor === 'netease' ? `${i.coverImgUrl}?param=120y120` : `${i.imgurl}`,
              title: i.name || i.dissname,
              subtitle: i.description || i.introduction
            })),
            moreText: data.isSheetOfText,
            haveMore: data.isSheetOf,
            moreAction: sheetOf,
            clickItemAction: sheet
          }
        }
      ];
    });
    console.log(listData.value[0].item.items);

    return {
      data,
      listData,
      searchData,
      play,
      sheet
    };
  }
});
</script>

<style lang="scss" scoped>
@import '~@/renderer/views/scss/mixin.scss';

.Search-details-info {
  height: calc(100% - 50px);

  .header {
    //padding-top: 40px;
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
      grid-gap: 22px 22px;
      width: 100%;
      height: 100%;
      padding: 20px 0 10px;

      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      @media screen and (min-width: 1100px) {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
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
