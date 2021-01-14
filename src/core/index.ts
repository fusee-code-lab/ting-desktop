import {reactive, ref, watch} from "vue";
import Log from "@/lib/log";
import {getGlobal, debounce, getExternPath} from "@/lib";
import {Vendors} from "@/core/musicapi/api";
import {writeFile} from "@/lib/file";

export enum PlayTypeOpt { //播放类型
    list,
    single,
    random
}

export interface SongOpt {
    id: number, //当前歌曲id
    vendor: Vendors; //歌曲来源
    name: string; //歌曲名称
    cover: string; //歌曲图片
    singer: string; //歌手
    path?: string; //歌曲链接
}

export interface TingAudioOpt {
    playType: PlayTypeOpt; //播放模式
    volume: number; //音量
    volumeGradualTime: number;//音量渐进时间(秒)
    paused: number;//音频是否暂停  0暂停 1未暂停
    cachedType: number; //缓存进度 0-1  1为完成
    cachedTime: number; //已缓存时长
    ingTime: number; //当前播放时长
    allTime: number; //当前歌曲总时长
    songInfo?: SongOpt; //当前播放歌曲信息
}

export interface TingCfgOpt {
    sheet: string; //歌单路径
    down: string; //下载歌曲存储路径
}

/**
 * 歌曲类型
 */
export const SongType: string[] = [
    "mp3",
    "wav",
    "wma",
    "midi"
];

/**
 * 歌单后缀
 */
export const sheetSuffix: string = ".ting";//歌单后缀名

let cfg: TingCfgOpt = {
    sheet: "./data/sheet", //歌单路径
    down: "./data/down", //下载歌曲存储路径
}

let audio: TingAudioOpt = {
    playType: PlayTypeOpt.list,//播放模式
    volume: 1, //音量
    volumeGradualTime: 0.7,//音量渐进时间(秒)
    paused: 1, //音频是否暂停  0未暂停 1暂停
    cachedType: 0, //缓存进度 0-1  1为完成
    cachedTime: 0, //已缓存时长
    ingTime: 0, //当前播放时长
    allTime: 0, //当前歌曲总时长
    songInfo: null //当前播放歌曲信息
};

let audioPlayList: { [key: string]: SongOpt } = {};

try {
    cfg = getGlobal("setting")["cfg"];
    audio = getGlobal("setting")["audio"];
} catch (e) {
    Log.error("[getSetting]", e);
}

/**
 * 播放器设置数据
 */
export const tingCfgData = reactive(cfg);

/**
 * 当前播放器播放状态数据
 */
export const audioData = reactive({
    ...audio,
    paused: 1,
    cachedType: 0,
    cachedTime: 0,
    ingTime: 0,
    allTime: 0
});

/**
 * 当前播放歌单
 */
export const audioPlayListData = ref(audioPlayList);

/**
 * 搜索数据结构
 */
export const searchData = reactive({
    keyword: "", //搜索关键字
    singleData: { //单曲列表
        songs: [],
        total: 0
    },
    sheetData: { //歌单列表
        sheets: [],
        qqTotal: 0,
        neteaseTotal: 0
    }
});

/**
 * 获取歌单路径
 * @param path 歌单名称
 */
export function getSheetPath(path: string) {
    return `${tingCfgData.sheet}/${path}${sheetSuffix}`;
}

/**
 * 监听 音量、播放类型 变化
 */
function watchTingOpt() {
    const audio = {
        playType: audioData.playType,
        volume: audioData.volume,
        volumeGradualTime: audioData.volumeGradualTime,
        songInfo: audioData.songInfo
    }
    writeFile(getExternPath("audio.json"), JSON.stringify(audio)).then();
}

watch(() => [audioData.volume, audioData.playType], debounce(watchTingOpt, 3000));