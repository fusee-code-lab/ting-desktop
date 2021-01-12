import {EOL} from "os";
import {reactive} from "vue";
import {TingPath, getSheetPath, sheetSuffix} from "@/core"
import {readLine, writeFile, appendFile, findFileBySuffix} from "@/lib/file";
import Log from "@/lib/log";

export const sheetData = reactive({
    list: [] //歌单列表
});

export const songData = reactive({
    list: [] //播放列表
})

export interface SheetList {
    name: string; //歌单名称
    cover?: string; //图片地址
    path: string; //歌单对应文件路径
}

export interface SongData {
    name: string; //歌曲名称
    url: string; //歌曲地址
    cover: string; //图片地址
    album: { cover: string; id: number; name: string; }; //专辑信息
    artists: [{ id: number; name: string }]; //歌手
}

/**
 * 当前歌单列表
 */
export function list() {
    let req = findFileBySuffix(TingPath.sheet, sheetSuffix);
    for (let i of req) {
        readLine(i, -1).then((e: string) => {
            try {
                if (e) sheetData.list.push(JSON.parse(e));
            } catch (e) {
                Log.error(e);
            }
        });
    }
}

/**
 * 歌单详情
 * @param path
 */
async function details(path: string) {
    try {
        let data = await readLine(path) as string[];
        data.shift();
        songData.list = data.map(e => JSON.parse(e)) as SongData[];
    } catch (e) {
        Log.error(e);
    }
}

/**
 * 创建歌单
 */
async function create(name: string, data: SheetList) {
    return await writeFile(getSheetPath(name), Buffer.from(JSON.stringify(data) + EOL).toString("binary"), {encoding: "binary"});
}

/**
 * 添加歌曲到歌单
 */
async function addSong(path: string, data: SongData) {
    try {
        return await appendFile(path, Buffer.from(JSON.stringify(data) + EOL).toString("binary"));
    } catch (e) {
        return 0;
    }
}