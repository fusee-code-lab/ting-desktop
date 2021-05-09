import { reactive, ref, watch } from 'vue';
import { debounce, isNull } from '@/lib';
import { Vendors } from './musicapi';
import { writeFile } from '@/renderer/utils/file';
import { getAppPath, getGlobal, logError } from '@/renderer/utils';
import { windowSetSize } from '@/renderer/utils/window';
import { argsData } from '@/renderer/store';

export enum PlayTypeOpt { //播放类型
  list,
  single,
  random
}

export interface SongOpt {
  id: number; //当前歌曲id
  vendor: Vendors; //歌曲来源
  name?: string; //歌曲名称
  cover?: string; //歌曲图片
  singer?: string; //歌手
  path?: string; //歌曲链接
}

export interface SheetOpt {
  id?: number; //歌单id
  name: string; //歌单名称
  vendor?: Vendors; //歌单来源
}

export interface SheetListOpt {
  detail: SheetOpt;
  songs: SongOpt[];
}

export interface TingAudioOpt {
  type: 'normal' | 'mini'; //播放器显示模式
  playType: PlayTypeOpt; //播放模式
  volume: number; //音量
  volumeGradualTime: number; //音量渐进时间(秒)
  paused: number; //音频是否暂停  0暂停 1未暂停
  cachedType: number; //缓存进度 0-1  1为完成
  cachedTime: number; //已缓存时长
  ingTime: number; //当前播放时长
  allTime: number; //当前歌曲总时长
  songInfo?: SongOpt; //当前播放歌曲信息
}

export interface TingCfgOpt {
  first: boolean; //是否首次打开
  br: number; //音频质量
  sheet: string; //歌单路径
  down: string; //下载歌曲存储路径
}

export interface TingPlayListOpt {
  [key: string]: SongOpt;
}

export interface TingSheetListOpt {
  list: SheetListOpt[];
  index: string;
}

/**
 * 歌曲类型
 */
export const SongType: string[] = ['mp3', 'wav', 'wma', 'midi'];

/**
 * 歌单后缀
 */
export const sheetSuffix: string = '.ting'; //歌单后缀名

let cfg: TingCfgOpt = {
  first: true, //是否第一次打开
  br: 192, //音频质量（当前仅网易云适用）
  sheet: getAppPath('music') + '/ting/sheet', //默认歌单路径
  down: getAppPath('music') + '/ting/down' //默认下载歌曲存储路径
};

let audio: TingAudioOpt = {
  type: 'normal',
  playType: PlayTypeOpt.list, //播放模式
  volume: 1, //音量
  volumeGradualTime: 0.7, //音量渐进时间(秒)
  paused: 1, //音频是否暂停  0未暂停 1暂停
  cachedType: 0, //缓存进度 0-1  1为完成
  cachedTime: 0, //已缓存时长
  ingTime: 0, //当前播放时长
  allTime: 0, //当前歌曲总时长
  songInfo: null //当前播放歌曲信息
};

let audioSheetList: TingSheetListOpt = {
  list: [],
  index: ''
};

let audioPlayList: TingPlayListOpt = {};

try {
  if (getGlobal('setting')['cfg']) cfg = getGlobal('setting')['cfg'];
  if (getGlobal('setting')['audio']) audio = getGlobal('setting')['audio'];
  if (!!audio.songInfo)
    audioPlayList[`${audio.songInfo.vendor}|${audio.songInfo.id}`] = audio.songInfo;
} catch (e) {
  logError('[getSetting]', e);
}

/**
 * 播放器设置数据
 */
export const tingCfgData = reactive<TingCfgOpt>(cfg);

/**
 * 当前播放器播放状态数据
 */
export const audioData = reactive<TingAudioOpt>({
  ...audio,
  paused: 1,
  cachedType: 0,
  cachedTime: 0,
  ingTime: 0,
  allTime: 0
});

/**
 * 歌单列表
 */
export const audioSheetListData = reactive<TingSheetListOpt>(audioSheetList);

/**
 * 当前播放歌单
 */
export const audioPlayListData = ref<TingPlayListOpt>(audioPlayList);

/**
 * 搜索数据结构
 */
export const searchData = reactive({
  keyword: '', //搜索关键字
  singleData: {
    //单曲列表
    songs: [],
    qqTotal: 0,
    neteaseTotal: 0,
    offset: 0
  },
  sheetData: {
    //歌单列表
    sheets: [],
    qqTotal: 0,
    neteaseTotal: 0,
    offset: 0
  }
});

/**
 * 歌单详情(在线)
 */
export const sheetData = ref(null);

/**
 * 获取歌单路径
 * @param name 歌单名称
 */
export function getSheetPath(name: string) {
  return `${tingCfgData.sheet}/${name}${sheetSuffix}`;
}

/**
 * 切换播放器状态
 */
export function switchAudioType(type?: string) {
  if (!isNull(type)) {
    if (type === 'mini') windowSetSize(argsData.window.id, [195, 150], false);
  } else {
    if (audioData.type === 'normal') {
      windowSetSize(argsData.window.id, [195, 150], false);
      audioData.type = 'mini';
    } else {
      windowSetSize(argsData.window.id, [980, 700]);
      audioData.type = 'normal';
    }
  }
}

/**
 * 监听 音量、播放类型 变化
 */
function TingAudioWatch() {
  const audio = {
    type: audioData.type,
    playType: audioData.playType,
    volume: audioData.volume,
    volumeGradualTime: audioData.volumeGradualTime,
    songInfo: audioData.songInfo
  };
  writeFile(getAppPath('userData') + '/cfg/audio.json', JSON.stringify(audio)).then((e) =>
    console.log('[TingAudioWatch]', e)
  );
}

watch(
  () => [audioData.volume, audioData.playType, audioData.type, audioData.songInfo?.cover],
  debounce(TingAudioWatch, 3000)
);

/**
 * 监听 路径配置变化
 */
function TingCfgWatch() {
  const index = {
    first: tingCfgData.first,
    br: tingCfgData.br,
    sheet: tingCfgData.sheet,
    down: tingCfgData.down
  };
  writeFile(getAppPath('userData') + '/cfg/index.json', JSON.stringify(index)).then((e) =>
    console.log('[TingCfgWatch]', e)
  );
}

watch(
  () => [tingCfgData.first, tingCfgData.br, tingCfgData.down, tingCfgData.sheet],
  debounce(TingCfgWatch, 1000)
);
