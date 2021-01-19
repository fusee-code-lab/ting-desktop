import {EOL} from "os";
import {
    tingCfgData,
    audioSheetListData,
    getSheetPath,
    sheetSuffix,
    SheetOpt,
    SongOpt,
    SheetListOpt
} from "@/core"
import {readLine, writeFile, appendFile, findFileBySuffix} from "@/lib/file";
import Log from "@/lib/log";

/**
 * 当前歌单列表
 */
export async function sheetList() {
    let req = findFileBySuffix(tingCfgData.sheet, sheetSuffix);
    if (req) {
        let data: SheetListOpt[] = [];
        for (let i of req) {
            let res = await readLine(i, -1);
            if (res) {
                let sheet = JSON.parse(res as string) as SheetOpt;
                if (sheet) data.push({
                    detail: sheet,
                    songs: []
                })
            }
        }
        audioSheetListData.list = data;
    }
}

/**
 * 歌单详情
 * @param name
 */
async function sheetDetails(name: string) {
    try {
        let data = await readLine(getSheetPath(name)) as string[];
        data.shift();
        audioSheetListData.list[audioSheetListData.list.map(e => e.detail.name).indexOf(name)].songs = data.map(e => JSON.parse(e)) as SongOpt[];
    } catch (e) {
        Log.error(e);
    }
}

/**
 * 创建歌单
 */
export async function sheetCreate(name: string, data: SheetOpt) {
    return await writeFile(getSheetPath(name), Buffer.from(JSON.stringify(data) + EOL).toString("binary"), {encoding: "binary"});
}

/**
 * 添加歌曲到歌单
 */
export async function sheetAddSong(path: string, data: SongOpt) {
    try {
        return await appendFile(path, Buffer.from(JSON.stringify(data) + EOL).toString("binary"));
    } catch (e) {
        return 0;
    }
}