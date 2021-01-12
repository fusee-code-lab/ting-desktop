import {reactive, watch} from "vue";
import Log from "@/lib/log";
import {getGlobal, debounce, getExternPath} from "@/lib";
import {writeFile} from "@/lib/file";

let path = {
    sheet: "./data/sheet", //歌单路径
    down: "./data/down", //下载歌曲存储路径
}
let volume = 1; //音量

try {
    path = getGlobal("setting")["path"];
    volume = getGlobal("setting")["audio"]["volume"];
} catch (e) {
    Log.error("[getSetting]", e);
}

export const AudiosOpt = reactive({
    paused: 0, //音频是否暂停  0暂停 1未暂停
    volume, //音量
    volumeGradualTime: 0.7,//音量渐进时间(秒)
    cachedType: 0, //缓存进度 0-1  1为完成
    cachedTime: 0, //已缓存时长
    ingTime: 0, //当前播放时长
    allTime: 0, //当前歌曲总时长
    songInfo: null //当前歌曲信息
});

//监听音量变化
function watchVolume() {
    let setting = getGlobal("setting");
    setting["audio"]["volume"] = AudiosOpt.volume;
    console.log("setting")
    writeFile(getExternPath("setting.json"), JSON.stringify(setting)).then();
}

watch(() => AudiosOpt.volume, debounce(watchVolume, 3000));

export const TingPath = reactive(path);

export const SongType: string[] = [
    "mp3",
    "wav",
    "wma",
    "midi"
];

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
    return `${TingPath.sheet}/${path}${sheetSuffix}`;
}

