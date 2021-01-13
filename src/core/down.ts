import {writeFile} from "@/lib/file";
import {TingCfg, SongType} from "@/core";
import {net, NET_RESPONSE_TYPE} from "@/lib/net";

/**
 * 保存歌曲
 * @param path
 * @param name
 */
export async function save(path: string, name: string) {
    let suffix = "";
    for (let i of SongType) {
        if (path.indexOf(i) > -1) {
            suffix = i;
            break;
        }
    }
    let req = await net(path, {type: NET_RESPONSE_TYPE.BUFFER})
        .catch(() => {
            return null;
        })
    if (req) {
        return await writeFile(
            `${TingCfg.path.down}/${name}.${suffix}`,
            Buffer.from(req).toString("binary"),
            {encoding: "binary"});
    } else return 0;
}
