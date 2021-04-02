import { lyric_decode, noSongsDetailMsg, pagination } from '../util';
import { isNull } from '@/lib';
import { base, getMusicInfo, getMusicInfo2 } from './base';

export async function searchSong({ keyword = '', limit = 30, offset = 0, type = 1 }) {
  // *(type)* 搜索单曲(1)，歌手(100)，专辑(10)，歌单(1000)，用户(1002)
  const params = {
    csrf_token: '',
    limit,
    type,
    s: keyword,
    offset
  };
  try {
    let { result } = await base('/weapi/cloudsearch/get/web', 'POST', params);
    if (type === 1) {
      if (!result) {
        result = {
          songCount: 0,
          songs: []
        };
      }
      return {
        status: true,
        data: {
          total: result.songCount,
          songs: result.songs.map((item: any) => getMusicInfo(item))
        }
      };
    }
    if (type === 10) {
      if (!result) {
        result = {
          albumCount: 0,
          albums: []
        };
      }
      return {
        status: true,
        data: {
          total: result.albumCount,
          albums: result.albums.map((e: any) => {
            e.vendor = 'netease';
            return e;
          })
        }
      };
    }
    if (type === 1000) {
      if (!result) {
        result = {
          playlistCount: 0,
          playlists: []
        };
      }
      return {
        status: true,
        data: {
          total: result.playlistCount,
          sheets: result.playlists.map((e: any) => {
            e.vendor = 'netease';
            return e;
          })
        }
      };
    }
  } catch (e) {
    console.warn(e);
    return {
      status: false,
      msg: '获取失败',
      log: e
    };
  }
}

export async function getSongDetail(id: number | string) {
  try {
    let data = await base('/weapi/v3/song/detail', 'POST', {
      c: JSON.stringify([{ id: id }]),
      ids: '[' + id + ']',
      csrf_token: ''
    });
    const info = data.songs[0];
    if (!info) {
      return {
        status: false,
        msg: noSongsDetailMsg
      };
    }
    return {
      status: true,
      data: getMusicInfo(info, data.privileges[0])
    };
  } catch (e) {
    return {
      status: false,
      msg: '请求失败',
      log: e
    };
  }
}

export async function getBatchSongDetail(ids: number[]) {
  try {
    let data = await base('/weapi/v3/song/detail', 'POST', {
      c: JSON.stringify(ids.map((item) => ({ id: item }))),
      ids: JSON.stringify(ids),
      csrf_token: ''
    });
    const privilegeObject: { [key: string]: any } = {};
    data.privileges.forEach((item: any) => {
      privilegeObject[item.id] = item;
    });
    return {
      status: true,
      data: data.songs.map((info: any) => getMusicInfo(info, privilegeObject[info.id]))
    };
  } catch (e) {
    return {
      status: false,
      msg: '请求失败',
      log: e
    };
  }
}

export async function getSongUrl(id: number | string, br = 128000) {
  const params = {
    ids: [id],
    br,
    csrf_token: ''
  };
  try {
    let { data } = await base('/weapi/song/enhance/player/url', 'POST', params);
    try {
      if (isNull(data[0])) {
        return {
          status: false,
          msg: '获取失败'
        };
      } else {
        return {
          status: true,
          data: {
            url: data[0].url,
            br: data[0].br,
            size: data[0].size
          }
        };
      }
    } catch (e) {
      return {
        status: false,
        msg: '获取失败'
      };
    }
  } catch (e) {
    return {
      status: false,
      msg: '获取失败',
      log: e
    };
  }
}

export async function getLyric(id: number | string) {
  try {
    let data = await base(
      '/weapi/song/lyric?lv=-1&kv=-1&tv=-1',
      'POST',
      {
        id
      },
      {
        crypto: 'linuxapi'
      }
    );
    if (data.lrc && data.lrc.lyric) {
      const translateDecodeData: any = lyric_decode(data.tlyric.lyric) || [];
      const translate = [];
      for (let i = 0; i < translateDecodeData.length - 1; i++) {
        if (translateDecodeData[i][1] !== translateDecodeData[i + 1][1]) {
          translate.push(translateDecodeData[i]);
        }
      }
      if (translateDecodeData.length) {
        translate.push(translateDecodeData.pop());
      }
      return {
        status: true,
        data: {
          lyric: lyric_decode(data.lrc.lyric),
          translate
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
    return {
      status: false,
      msg: '请求失败',
      log: e
    };
  }
}

export async function getTopList(id: number | string, limit = 1000) {
  try {
    const { playlist, privileges } = await base('/weapi/v3/playlist/detail', 'POST', {
      id,
      offset: 0,
      total: true,
      n: limit,
      csrf_token: ''
    });
    let songs: any[] = [];
    if (playlist.trackIds.length > 1) {
      let arr = [];
      const limit = 1000;
      for (let i = 0; i < playlist.trackIds.length; i++) {
        arr.push(playlist.trackIds[i].id);
        // 达到限制 或 已是数组最后一个
        if (arr.length === limit || i + 1 === playlist.trackIds.length) {
          // 获取详情
          const data = await getBatchSongDetail(arr);
          if (data.status) {
            songs = songs.concat(data.data);
          }
          // 重置待处理的数组
          arr = [];
        }
      }
    }
    return {
      status: true,
      data: {
        name: playlist.name,
        description: playlist.description,
        cover: playlist.coverImgUrl,
        playCount: playlist.playCount,
        list: songs
      }
    };
  } catch (e) {
    return {
      status: false,
      msg: '获取失败',
      log: e
    };
  }
}

export async function getComment(rid: number | string, page: number, limit = 20) {
  try {
    let { hotComments, comments, total } = await base(
      '/weapi/v1/resource/comments/R_SO_4_' + rid + '/?csrf_token=',
      'POST',
      {
        offset: (page - 1) * limit,
        rid,
        limit,
        csrf_token: ''
      }
    );
    return {
      status: true,
      data: {
        hotComments: hotComments || [],
        comments: comments || [],
        total
      }
    };
  } catch (e) {
    return {
      status: false,
      msg: '请求失败',
      log: e
    };
  }
}

export async function getArtistSongs(id: number | string, offset: number, limit: number) {
  try {
    let data = await base(`/weapi/v1/artist/${id}`, 'POST', {
      csrf_token: '',
      offset,
      limit
    });
    return {
      status: true,
      data: {
        detail: {
          id,
          name: data.artist.name,
          avatar: data.artist.img1v1Url,
          desc: data.artist.briefDesc
        },
        songs: data.hotSongs.map((item: any) => getMusicInfo(item))
      }
    };
  } catch (e) {
    return {
      status: false,
      msg: '请求失败',
      log: e
    };
  }
}

export async function getPlaylistDetail(id: number | string, offset: number, limit: number) {
  try {
    const { playlist } = await base(`/weapi/v3/playlist/detail`, 'POST', {
      id,
      n: 100000,
      s: 8,
      csrf_token: ''
    });
    let songs: any = [];
    let privileges = pagination(offset, limit, playlist.trackIds);
    if (privileges.length > 1) {
      let arr = [];
      for (let i = 0; i < privileges.length; i++) {
        arr.push(privileges[i].id);
        if (privileges.length - 1 === i) {
          const data = await getBatchSongDetail(arr);
          if (data.status) {
            songs = songs.concat(data.data);
          }
        }
      }
    }
    return {
      status: true,
      data: {
        detail: {
          userLink: `https://music.163.com/#/user/home?id=${playlist.userId}`,
          id: playlist.id,
          name: playlist.name,
          cover: playlist.coverImgUrl,
          desc: playlist.description,
          tags: playlist.tags,
          count: playlist.trackCount,
          creat_name: playlist.creator.nickname
        },
        songs,
        song_all: playlist.trackIds.map((e: any) => {
          return {
            id: e.id,
            vendor: 'netease'
          };
        })
      }
    };
  } catch (e) {
    return {
      status: false,
      msg: '请求失败',
      log: e
    };
  }
}

export async function getAlbumDetail(id: number | string) {
  try {
    const { album, songs } = await base(`/weapi/v1/album/${id}`, 'POST', {});
    return {
      status: true,
      data: {
        name: album.name,
        cover: album.picUrl,
        artist: {
          id: album.artist.id,
          name: album.artist.name
        },
        desc: album.description,
        publishTime: album.publishTime,
        songs: songs.map((item: any) => getMusicInfo(item))
      }
    };
  } catch (e) {
    return {
      status: false,
      msg: '请求失败',
      log: e
    };
  }
}

export async function getBanner() {
  try {
    const { data } = await base(
      'http://music.163.com/discover',
      'GET',
      {},
      {
        pureFly: true
      }
    );
    const pattern = /window.Gbanners[\s\S]+?(\[[\s\S]+?\])/;
    const banners = pattern.exec(data)[1];
    return {
      status: true,
      data: eval(banners)
    };
  } catch (e) {
    return {
      status: false,
      msg: '请求失败',
      log: e
    };
  }
}

export async function getMvDetail(id: number | string) {
  try {
    const { data } = await base(`/weapi/mv/detail`, 'POST', {
      id
    });
    return {
      status: true,
      data
    };
  } catch (e) {
    return {
      status: false,
      msg: '请求失败',
      log: e
    };
  }
}

export async function getMvComment(id: number, page = 1, limit = 20) {
  try {
    const data = await base(`/weapi/v1/resource/comments/R_MV_5_${id}/?csrf_token=`, 'POST', {
      offset: (page - 1) * limit,
      rid: id,
      limit,
      csrf_token: ''
    });
    return {
      status: true,
      data: {
        total: data.total || 0,
        hotComments: data.hotComments || [],
        comments: data.comments || []
      }
    };
  } catch (e) {
    return {
      status: false,
      msg: '请求失败',
      log: e
    };
  }
}

export async function getTopPlaylist(cat = '全部', page = 1, limit = 20) {
  try {
    const data = await base(`/weapi/playlist/highquality/list`, 'POST', {
      cat,
      offset: (page - 1) * limit,
      limit,
      csrf_token: ''
    });
    return {
      status: true,
      data: data.playlists
    };
  } catch (e) {
    return {
      status: false,
      msg: '请求失败',
      log: e
    };
  }
}

export async function getNewestMvs(limit = 20) {
  try {
    const { data } = await base('/weapi/mv/first', 'POST', {
      total: true,
      limit,
      csrf_token: ''
    });
    return {
      status: true,
      data
    };
  } catch (e) {
    return {
      status: false,
      msg: '请求失败',
      log: e
    };
  }
}

export async function getRecommendSongs(page = 1, limit = 30) {
  try {
    let data = await base(`/weapi/v1/discovery/recommend/songs`, 'POST', {
      limit,
      offset: page - 1,
      total: true
    });
    return {
      status: true,
      data: data.recommend.map((item: any) => getMusicInfo2(item))
    };
  } catch (e) {
    return {
      status: false,
      msg: '请求失败',
      log: e
    };
  }
}

export async function getPersonalizedPlaylist(page = 1, limit = 30) {
  try {
    let data = await base(`/weapi/personalized/playlist`, 'POST', {
      limit: 30,
      offset: page - 1,
      total: true,
      n: 1000
    });
    return {
      status: true,
      data: data.result
    };
  } catch (e) {
    return {
      status: false,
      msg: '请求失败',
      log: e
    };
  }
}

export async function getAllTopList() {
  try {
    const data = await base('/weapi/toplist/detail', 'POST', {});
    return {
      status: true,
      data: data.list.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          cover: item.coverImgUrl,
          list: item.tracks.map((track: any) => {
            return {
              artists: [
                {
                  name: track.second
                }
              ],
              name: track.first
            };
          })
        };
      })
    };
  } catch (e) {
    return e;
  }
}
