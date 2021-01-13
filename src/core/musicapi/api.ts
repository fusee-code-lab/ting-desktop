import instance from "./util/flyio.node";
import neteaseBase from './netease/instance/base';
import qqBase from './qq/instance/base';
import Netease from './netease';
import QQ from './qq';

export enum Vendors {
    netease = "netease",
    qq = "qq"
}

export const provider = {
    netease: Netease(neteaseBase(instance)),
    qq: QQ(qqBase(instance))
};

// 获取歌曲详情
export async function getSongDetail(vendor: Vendors, id: number | string) {
    return await provider[vendor]['getSongDetail'](id)
}

// 批量获取歌曲详情
export async function getBatchSongDetail(vendor: Vendors, id: number | string) {
    return await provider[vendor]['getBatchSongDetail'](id)
}

//获取歌曲url
export async function getSongUrl(vendor: Vendors, id: number | string) {
    return await provider[vendor]['getSongUrl'](id)
}

// 获取歌词
export async function getLyric(vendor: Vendors, id: number | string) {
    return await provider[vendor]['getLyric'](id)
}

// 获取歌曲评论
export async function getComment(vendor: Vendors, id: number | string, page = 1, limit = 20) {
    return await provider[vendor]['getComment'](id, page, limit)
}

// 获取歌手单曲
export async function getArtistSongs(vendor: Vendors, id: number | string, offset = 0, limit = 50) {
    return await provider[vendor]['getArtistSongs'](id, offset, limit)
}

// 获取歌单歌曲
export async function getPlaylistDetail(vendor: Vendors, id: number | string, offset = 0, limit = 65535) {
    return await provider[vendor]['getPlaylistDetail'](id, offset, limit)
}

// 获取专辑详情
export async function getAlbumDetail(vendor: Vendors, id: number | string) {
    return await provider[vendor]['getAlbumDetail'](id)
}

// 批量获取任意vendor歌曲详情
export async function getAnyVendorSongDetail(arr: [], timeout = 0) {
    // 先分类
    let songsList: { [key: string]: any } = {
        netease: [],
        qq: []
    }
    arr.forEach((item: any) => {
        songsList[item.vendor].push(item.id)
    })
    // 分类 批量获取详情 并存入歌曲对象
    let songsObject: { [key: string]: any } = {}
    for (let vendor of Object.keys(songsList)) {
        const list = songsList[vendor]
        if (!list.length) continue
        let limit = vendor === "qq" ? 50 : 1000;
        let arr = []
        for (let index = 0; index < list.length; index++) {
            arr.push(list[index])
            // 达到限制 或 已是数组最后一个
            if (arr.length === limit || index + 1 === list.length) {
                // 获取详情
                const data = await this.getBatchSongDetail(vendor, arr)
                if (data.status) {
                    data.data.forEach((song: any) => {
                        songsObject[`${vendor}_${song.id}`] = song
                    })
                } else {
                    console.warn(`${vendor}获取详情失败`)
                }
                // 重置待处理的数组
                arr = []
                if (timeout) {
                    await new Promise(resolve => {
                        setTimeout(() => {
                            resolve(1)
                        }, timeout)
                    })
                }
            }
        }
    }
    // 整理结果
    const rs = []
    for (let {id, vendor} of arr) {
        const song = songsObject[`${vendor}_${id}`]
        if (song) {
            rs.push(song)
        } else {
            /*
            有可能是：歌曲id错误、更改了歌曲id、云平台删歌、批量获取详情失败 此处无法判断
            且有可能这种状态的歌曲数量较多 调单个获取接口有可能会导致被ban ip 此处直接返null
            */
            console.warn(`歌曲无法获取详情：${vendor} ${id}`)
            rs.push(null)
        }
    }
    return rs
}