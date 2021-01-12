import {writeFile} from "@/lib/file";
import {TingPath, SongType} from "@/core";

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
    let req = await fetch(path)
        .then(e => e.arrayBuffer())
        .catch(() => {
            return null;
        })
    if (req) {
        return await writeFile(
            `${TingPath.down}/${name}.${suffix}`,
            Buffer.from(req).toString("binary"),
            {encoding: "binary"});
    } else return 0;
}
