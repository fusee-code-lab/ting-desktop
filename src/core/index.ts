import {reactive, watch} from "vue";
import Log from "@/lib/log";
import {getGlobal, debounce, getExternPath} from "@/lib";
import {Vendors} from "@/core/musicapi/api";
import {writeFile} from "@/lib/file";

export interface SongOpt {
    id: number, //当前歌曲id
    name: string; //歌曲名称
    cover: string; //歌曲图片
    singer: string; //歌手
    vendor: Vendors; //歌曲来源
    path?: string; //歌曲链接
}

export interface TingAudioOpt {
    volume: number; //音量
    volumeGradualTime: number;//音量渐进时间(秒)
    paused: number;//音频是否暂停  0暂停 1未暂停
    cachedType: number; //缓存进度 0-1  1为完成
    cachedTime: number; //已缓存时长
    ingTime: number; //当前播放时长
    allTime: number; //当前歌曲总时长
    songInfo?: SongOpt; //当前歌曲信息
}

export interface TingPathOpt {
    sheet: string; //歌单路径
    down: string; //下载歌曲存储路径
}

export const SongType: string[] = [
    "mp3",
    "wav",
    "wma",
    "midi"
];

let path: TingPathOpt = {
    sheet: "./data/sheet", //歌单路径
    down: "./data/down", //下载歌曲存储路径
}

let audio: TingAudioOpt = {
    volume: 1, //音量
    volumeGradualTime: 0.7,//音量渐进时间(秒)
    paused: 0, //音频是否暂停  0暂停 1未暂停
    cachedType: 0, //缓存进度 0-1  1为完成
    cachedTime: 0, //已缓存时长
    ingTime: 0, //当前播放时长
    allTime: 0, //当前歌曲总时长
    songInfo: null //当前歌曲信息
};

try {
    path = getGlobal("setting")["path"];
    audio = getGlobal("setting")["audio"];
} catch (e) {
    Log.error("[getSetting]", e);
}

export const TingCfg = reactive({
    path,
    audio: {
        ...audio,
        paused: 0,
        cachedType: 0,
        cachedTime: 0,
        ingTime: 0,
        allTime: 0
    }
});

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

export const sheetSuffix: string = ".ting";//歌单后缀名

/**
 * 获取歌单路径
 * @param path 歌单名称
 */
export function getSheetPath(path: string) {
    return `${TingCfg.path.sheet}/${path}${sheetSuffix}`;
}


/**
 * 监听 音量变化
 */
function watchTingOpt() {
    const setting = {
        audio: {
            volume: TingCfg.audio.volume,
            volumeGradualTime: TingCfg.audio.volumeGradualTime,
            songInfo: TingCfg.audio.songInfo
        },
        path: TingCfg.path
    }
    writeFile(getExternPath("setting.json"), JSON.stringify(setting)).then();
}

watch(() => [TingCfg.audio.volume], debounce(watchTingOpt, 3000));