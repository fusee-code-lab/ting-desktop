<template>
  <div class="search-info">
    <input placeholder="搜索" v-model.trim="keyword" @keydown.enter="search" />
    <button @click="search"></button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { isNull } from '@/utils';
import { audioSheetListData, searchData } from '@/renderer/core';
import { searchSheet, searchSong } from '@/renderer/core/musicapi';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Search',
  setup() {
    const keyword = ref('');

    const router = useRouter();
    async function search() {
      if (isNull(keyword.value)) return;
      searchData.singleData.offset = 0;
      searchData.sheetData.offset = 0;
      let reqs = (await Promise.all([
        searchSong(keyword.value),
        searchSheet(keyword.value)
      ])) as any;
      searchData.keyword = keyword.value;
      console.log(reqs);
      if (reqs[0] && reqs[0].status) {
        searchData.singleData.neteaseTotal = reqs[0].data.neteaseTotal;
        searchData.singleData.qqTotal = reqs[0].data.qqTotal;
        searchData.singleData.songs = reqs[0].data.songs;
      }
      if (reqs[1] && reqs[1].status) {
        searchData.sheetData.neteaseTotal = reqs[1].data.neteaseTotal;
        searchData.sheetData.qqTotal = reqs[1].data.qqTotal;
        searchData.sheetData.sheets = reqs[1].data.sheets;
      }
      // messageData[messageKeys.Show] = componentShow.SearchDetails; // TODO

      router.push("/main/search");
    }

    return {
      keyword,
      audioSheetListData,
      search
    };
  }
});
</script>
<style lang="scss" scoped>
@import '~@/renderer/views/scss/mixin.scss';

.search-info {
  position: relative;
  display: flex;
  flex-shrink: 0;
  z-index: 1;
  padding: 0 0 10px;

  > input {
    background-color: #ffffff;
    height: 26px;
    width: calc(100% - 32px);
    margin: 0;
    font: normal 12px/12px ping-fang;
    color: var(--label);

    &::-webkit-input-placeholder {
      color: var(--secondary-label);
    }
  }

  > button {
    background-color: #ffffff;
    width: 32px;
    height: 26px;
    margin: 0;
    padding: 0;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover,
    &:active {
      background-image: none;
    }

    &:before {
      @include device-pixel('~@/assets/icons/search_icon');
      content: '';
      width: 15px;
      height: 15px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
  }
}
</style>
