import { lyric_decode, noSongsDetailMsg } from '../util';
import { random, isNull } from '@/lib';
import { base, getMusicInfo, getMusicInfo2 } from './base';

export async function searchSong({
  keyword = '',
  limit = 30,
  offset = 0,
  remoteplace = 'txt.yqq.song'
}) {
  let params: { [key: string]: any } = {
    p: offset + 1,
    n: limit,
    w: keyword,
    ct: 24,
    remoteplace,
    aggr: 1,
    cr: 1,
    lossless: 0
  };
  let url = '/soso/fcgi-bin/client_search_cp';
  if (remoteplace === 'txt.yqq.playlist') {
    url = '/soso/fcgi-bin/client_music_search_songlist';
    params = {
      flag_qc: 0,
      page_no: offset,
      num_per_page: limit,
      remoteplace,
      query: keyword
    };
  }
  try {
    let data = await base(url, params);
    if (remoteplace === 'txt.yqq.playlist') {
      return {
        status: true,
        data: {
          total: data.data.display_num,
          sheets: data.data.list.map((e: any) => {
            e.vendor = 'qq';
            return e;
          })
        }
      };
    }
    return {
      status: true,
      data: {
        total: data.data.song.totalnum,
        songs: data.data.song.list.map((item: any) => getMusicInfo2(item))
      }
    };
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function getSongDetail(id: number | string, raw = false, type = 'songid') {
  try {
    const data = await base('/v8/fcg-bin/fcg_play_single_song.fcg', {
      [type]: id,
      format: 'json'
    });
    const info = data.data[0];
    if (!info) {
      return {
        status: false,
        msg: noSongsDetailMsg
      };
    }
    return {
      status: true,
      data: raw ? info : getMusicInfo(info)
    };
  } catch (e) {
    return e;
  }
}

export async function getBatchSongDetail(songids: number[]) {
  try {
    const data = await base('/v8/fcg-bin/fcg_play_single_song.fcg', {
      songid: songids.join(','),
      format: 'json'
    });
    return {
      status: true,
      data: data.data.map((item: any) => getMusicInfo(item))
    };
  } catch (e) {
    return e;
  }
}

export async function getMid(id: number | string) {
  const detailInfo = await this.getSongDetail(id, true);
  if (!detailInfo.status) {
    throw new Error(detailInfo.msg);
  }
  return detailInfo.data.mid;
}

export async function getSongUrl(songid: string | number, br = 128000) {
  const mid = await this.getMid(songid);
  const guid = `${Math.floor(Math.random() * 1000000000)}`;
  const uin = '0';
  let data;
  try {
    const {
      req: {
        data: { freeflowsip }
      },
      req_0: {
        data: { midurlinfo }
      }
    } = await base(
      '/cgi-bin/musicu.fcg',
      {
        data: JSON.stringify({
          req: {
            module: 'CDN.SrfCdnDispatchServer',
            method: 'GetCdnDispatch',
            param: {
              guid,
              calltype: 0,
              userip: ''
            }
          },
          req_0: {
            module: 'vkey.GetVkeyServer',
            method: 'CgiGetVkey',
            param: {
              guid,
              songmid: [mid],
              songtype: [0],
              uin,
              loginflag: 1,
              platform: '20'
            }
          },
          comm: { uin, format: 'json', ct: 24, cv: 0 }
        })
      },
      true
    );
    try {
      const host = freeflowsip[random(0, freeflowsip.length - 1)];
      if (isNull(midurlinfo[0].purl)) {
        data = {
          status: false,
          msg: '请求失败'
        };
      } else {
        data = {
          status: true,
          data: {
            url: host + midurlinfo[0].purl
          }
        };
      }
    } catch (e) {
      data = {
        status: false,
        msg: e.message || '请求失败'
      };
    }
  } catch (e) {
    data = {
      status: false,
      msg: e.message || '请求失败',
      log: e
    };
  }
  return data;
}

export async function getLyric(songid: number | string) {
  try {
    const mid = await this.getMid(songid);
    let data = await base('/lyric/fcgi-bin/fcg_query_lyric_new.fcg', {
      pcachetime: Date.parse(new Date().toUTCString()),
      songmid: mid
    });
    if (data.lyric) {
      return {
        status: true,
        data: {
          lyric: lyric_decode(new Buffer(data.lyric, 'base64').toString()),
          translate: lyric_decode(new Buffer(data.trans, 'base64').toString())
        }
      };
    } else {
      return {
        status: true,
        data: {
          lyric: [],
          translate: []
        }
      };
    }
  } catch (e) {
    return e;
  }
}

export async function getComment(songid: number | string, page = 1, pagesize = 20) {
  try {
    const { comment, hot_comment } = await base('/base/fcgi-bin/fcg_global_comment_h5.fcg', {
      reqtype: 2,
      biztype: 1,
      topid: songid,
      cmd: 8,
      needmusiccrit: 0,
      pagenum: page - 1,
      pagesize,
      lasthotcommentid: '',
      domain: 'qq.com'
    });
    return {
      status: true,
      data: {
        hotComments: hot_comment && hot_comment.commentlist ? hot_comment.commentlist : [],
        comments: comment.commentlist || [],
        total: comment.commenttotal
      }
    };
  } catch (e) {
    return e;
  }
}

export async function getArtistSongs(id: number | string, offset: number, limit: number) {
  try {
    const params = {
      platform: 'h5page',
      from: 'h5',
      singerid: id,
      order: 'listen',
      begin: offset * limit,
      num: limit,
      songstatus: 1
    };
    const { data } = await base('/v8/fcg-bin/fcg_v8_singer_track_cp.fcg', params);
    return {
      status: true,
      data: {
        detail: {
          id,
          name: data.singer_name,
          avatar: `http://y.gtimg.cn/music/photo_new/T001R300x300M000${data.singer_mid}.jpg`,
          desc: data.SingerDesc
        },
        songs: data.list.map((item: any) => getMusicInfo2(item.musicData))
      }
    };
  } catch (e) {
    return e;
  }
}

export async function getPlaylistDetail(id: string | number, offset: number, limit: number) {
  try {
    const params = {
      type: 1,
      json: 1,
      utf8: 1,
      onlysong: 0,
      disstid: id,
      format: 'json',
      inCharset: 'utf8',
      outCharset: 'utf-8',
      platform: 'yqq'
    };
    const { cdlist } = await base('/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg', params);
    return {
      status: true,
      data: {
        detail: {
          id: cdlist[0].disstid,
          name: cdlist[0].dissname,
          cover: cdlist[0].logo,
          desc: cdlist[0].desc,
          tags: cdlist[0].tags.map((e: any) => e.name),
          creat_name: cdlist[0].nickname
        },
        songs: cdlist[0].songlist.map((info: any) => getMusicInfo2(info))
      }
    };
  } catch (e) {
    return e;
  }
}

export async function getMusicu(data: any) {
  return base(
    '/cgi-bin/musicu.fcg',
    {
      data: JSON.stringify(data)
    },
    true
  );
}

export async function getArtists(offset = 0, param: any) {
  const { area = -100, sex = -100, genre = -100, index = -100 } = param || {};
  try {
    const { singerList } = await this.getMusicu({
      comm: {
        ct: 24,
        cv: 10000
      },
      singerList: {
        module: 'Music.SingerListServer',
        method: 'get_singer_list',
        param: {
          area,
          sex,
          genre,
          index,
          sin: offset * 80,
          cur_page: offset + 1
        }
      }
    });
    return {
      status: true,
      data: singerList.data
    };
  } catch (e) {
    return e;
  }
}

export async function getAlbumDetail(id: string | number) {
  try {
    const { data } = await base('https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg', {
      albumid: id,
      tpl: 'yqq_song_detail'
    });
    return {
      status: true,
      data: {
        name: data.name,
        cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${data.mid}.jpg`,
        artist: {
          id: data.singerid,
          name: data.singername
        },
        desc: data.desc,
        publishTime: Date.parse(data.aDate),
        songs: data.list.map((item: any) => getMusicInfo2(item))
      }
    };
  } catch (e) {
    return e;
  }
}

export async function getAllTopList() {
  const params = {
    page: 'index',
    format: 'html',
    tpl: 'macv4',
    v8debug: 1
  };
  try {
    let data = await base('/v8/fcg-bin/fcg_v8_toplist_opt.fcg', params);
    return {
      status: true,
      data: data
        .reduce((a: any, b: any) => a.List.concat(b.List))
        .map((item: any) => {
          return {
            id: item.topID,
            name: item.ListName,
            cover: item.pic_v12,
            list: item.songlist.map((item: any) => {
              return {
                artists: [
                  {
                    id: item.singerid,
                    name: item.singername
                  }
                ],
                name: item.songname,
                id: item.songid
              };
            })
          };
        })
    };
  } catch (e) {
    return e;
  }
}

export async function getTopList(id: string | number) {
  const params = {
    platform: 'h5',
    topid: id,
    tpl: 3,
    page: 'detail',
    type: 'top'
  };
  try {
    let data = await base('/v8/fcg-bin/fcg_v8_toplist_cp.fcg', params);
    return {
      status: true,
      data: {
        name: data.topinfo.ListName,
        description: data.topinfo.info,
        cover: data.topinfo.pic_v12,
        playCount: data.topinfo.listennum,
        list: data.songlist.map((item: any) => getMusicInfo2(item.data))
      }
    };
  } catch (e) {
    return e;
  }
}

export async function getUserInfo() {
  try {
    const { data } = await base('/portalcgi/fcgi-bin/music_mini_portal/fcg_getuser_infoEx.fcg');
    return {
      status: true,
      data
    };
  } catch (e) {
    return e;
  }
}

export async function getRecommendPlaylist() {
  try {
    const { recomPlaylist } = await this.getMusicu({
      comm: {
        ct: 24
      },
      recomPlaylist: {
        method: 'get_hot_recommend',
        param: {
          async: 1,
          cmd: 2
        },
        module: 'playlist.HotRecommendServer'
      }
    });
    return {
      status: true,
      data: recomPlaylist.data.v_hot
    };
  } catch (e) {
    return e;
  }
}

export async function getRecommendSongs(page = 1, limit = 30) {
  try {
    const { get_daily_track } = await this.getMusicu({
      comm: { ct: 6, cv: 50500 },
      get_daily_track: {
        module: 'music.ai_track_daily_svr',
        method: 'get_daily_track',
        param: {
          id: 99,
          cmd: 0,
          page: page - 1
        }
      }
    });
    return {
      status: true,
      data: get_daily_track.data.tracks.map((item: any) => getMusicInfo(item))
    };
  } catch (e) {
    return e;
  }
}
