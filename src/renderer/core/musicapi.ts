export enum Vendors {
  netease = 'netease',
  qq = 'qq'
}

export interface BSongArrayOpt {
  vendor: Vendors;
  id: number | string;
}

/**
 * 获取歌曲详情
 */
export async function getSongDetail(vendor: Vendors, id: number | string) {
  return await window.ipcFun.invoke('musicapi-getsongdetail', { vendor, id });
}

/**
 * 批量获取任意歌曲详情
 */
export async function getBSongDetail(arr: BSongArrayOpt[]) {
  return await window.ipcFun.invoke('musicapi-getbsongdetail', { arr });
}

/**
 * 获取歌曲播放链接
 */
export async function getSongUrl(vendor: Vendors, id: number | string, br: number) {
  return await window.ipcFun.invoke('musicapi-getsongurl', { vendor, id, br });
}

/**
 * 获取歌曲歌词
 */
export async function getLyric(vendor: Vendors, id: number | string) {
  return await window.ipcFun.invoke('musicapi-getlyric', { vendor, id });
}

/**
 * 搜索
 * @param keyword 关键字
 * @param limit 条数
 * @param offset 页码
 */
export async function searchSong(keyword: string, offset: number = 0, limit: number = 5) {
  return await window.ipcFun.invoke('musicapi-searchsong', { keyword, offset, limit });
}

/**
 * 搜索歌单
 */
export async function searchSheet(keyword: string, offset: number = 0, limit: number = 5) {
  return await window.ipcFun.invoke('musicapi-searchsheet', { keyword, offset, limit });
}

/**
 * 获取歌单详情
 */
export async function getPlaylistDetail(
  vendor: Vendors,
  id: number | string,
  offset: number = 0,
  limit: number = 65535
) {
  return await window.ipcFun.invoke('musicapi-getplaylistdetail', { vendor, id, offset, limit });
}

/**
 * 搜索专辑
 */
export async function searchAlbum(keyword: string, offset: number = 0, limit: number = 5) {
  return await window.ipcFun.invoke('musicapi-searchalbum', { keyword, offset, limit });
}

/**
 * 获取专辑详情
 */
export async function getAlbumDetail(vendor: Vendors, id: number | string) {
  return await window.ipcFun.invoke('musicapi-getalbumdetail', { vendor, id });
}
