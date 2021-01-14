<template>
  <div class="menu-info">
    <div class="menu-search">
      <input placeholder="搜索" v-model.trim="searchData.keyword" @keydown.enter="search"/>
      <button @click="search"></button>
    </div>
    <div class="menu-sheet">
      <div class="title">常听</div>
      <div class="content">

        <div class="item act">
          <div class="left">
            <div class="icon bg-img"></div>
            <div class="text">Nav item</div>
          </div>
        </div>

        <div class="item">
          <div class="left">
            <div class="icon bg-img"></div>
            <div class="text">Nav item</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {isNull} from "@/lib";
import {searchData} from "@/core";
import {searchSong, searchSheet} from "@/core/musicapi";

export default defineComponent({
  name: "Menu",
  setup() {

    async function search() {
      if (isNull(searchData.keyword)) return;
      let reqs = await Promise.all([searchSong(searchData.keyword), searchSheet(searchData.keyword)]) as any;
      if (reqs[0] && reqs[0].status) {
        searchData.singleData.total = reqs[0].data.total;
        searchData.singleData.songs = reqs[0].data.songs;
      }
      if (reqs[1] && reqs[1].status) {
        searchData.sheetData.neteaseTotal = reqs[1].data.neteaseTotal;
        searchData.sheetData.qqTotal = reqs[1].data.qqTotal;
        searchData.sheetData.sheets = reqs[1].data.sheets;
      }
    }

    return {
      searchData,
      search
    };
  }
});
</script>

<style lang="scss" scoped>
@import "../scss/menu";
</style>