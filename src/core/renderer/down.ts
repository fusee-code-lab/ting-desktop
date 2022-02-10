import { writeFile } from '@/renderer/common/file';
import { tingCfgData, SongType } from '@/renderer/core/index';
import net from '@/renderer/common/net';

/**
 * 保存歌曲
 * @param path
 * @param name
 */
export async function save(path: string, name: string) {
  let suffix = '';
  for (let i of SongType) {
    if (path.indexOf(i) > -1) {
      suffix = i;
      break;
    }
  }
  let req = await net<Buffer>(path, { type: 'BUFFER' }).catch(() => {
    return null;
  });
  if (req) {
    return await writeFile(
      `${tingCfgData.down}/${name}.${suffix}`,
      Buffer.from(req).toString('binary'),
      { encoding: 'binary' }
    );
  } else return 0;
}
