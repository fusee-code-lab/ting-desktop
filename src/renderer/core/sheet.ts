import {
  tingCfgData,
  audioSheetListData,
  getSheetPath,
  sheetSuffix,
  SheetOpt,
  SongOpt,
  SheetListOpt
} from '@/renderer/core/index';
import { readLine, writeFile, appendFile, fileBySuffix } from '@/renderer/utils/file';
import { logError, getGlobal } from '@/renderer/utils';

const EOL = getGlobal('EOL');

/**
 * 当前歌单列表
 */
export async function sheetList() {
  let req = await fileBySuffix(tingCfgData.sheet, sheetSuffix);
  if (req) {
    let data: SheetListOpt[] = [];
    for (let i of req) {
      let res = await readLine(i, -1);
      if (res) {
        let sheet = JSON.parse(res as string) as SheetOpt;
        if (sheet)
          data.push({
            detail: sheet,
            songs: []
          });
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
    let data = (await readLine(getSheetPath(name))) as string[];
    data.shift();
    audioSheetListData.list[
      audioSheetListData.list.map((e) => e.detail.name).indexOf(name)
      ].songs = data.map((e) => JSON.parse(e)) as SongOpt[];
  } catch (e) {
    logError(e);
  }
}

/**
 * 创建歌单
 */
export async function sheetCreate(name: string, data: SheetOpt) {
  return await writeFile(
    getSheetPath(name),
    JSON.stringify(data) + EOL,
    { encoding: 'binary' }
  );
}

/**
 * 添加歌曲到歌单
 */
export async function sheetAddSong(path: string, data: SongOpt) {
  try {
    return await appendFile(path, JSON.stringify(data) + EOL);
  } catch (e) {
    return 0;
  }
}
