import {EOL} from "os";
import {tingCfgData, audioSheetListData, getSheetPath, sheetSuffix, SheetOpt, SongOpt} from "@/core"
import {readLine, writeFile, appendFile, findFileBySuffix} from "@/lib/file";
import Log from "@/lib/log";

/**
 * 当前歌单列表
 */
export function sheetList() {
    let req = findFileBySuffix(tingCfgData.sheet, sheetSuffix);
    if (req) for (let i of req) {
        readLine(i, -1).then((e: string) => {
            try {
                let sheet = JSON.parse(e) as SheetOpt;
                if (sheet) audioSheetListData[`${sheet.vendor}|${sheet.id}`] = {
                    detail: sheet,
                    songs: []
                };
            } catch (e) {
                Log.error(e);
            }
        });
    }
}

/**
 * 歌单详情
 * @param key
 */
async function sheetDetails(key: string) {
    try {
        let data = await readLine(getSheetPath(audioSheetListData[key].detail.name)) as string[];
        data.shift();
        audioSheetListData[key].songs = data.map(e => JSON.parse(e)) as SongOpt[];
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