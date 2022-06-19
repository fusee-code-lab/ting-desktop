import net, { RequestOpt } from '@/main/modular/net';
import { randomUserAgent } from '../util';

const baseURL = 'https://c.y.qq.com';
const newURL = 'https://u.y.qq.com';

export async function base(uri: string, data?: any, newApi: boolean = false) {
  const url = `${newApi ? newURL : baseURL}${uri}`;
  let params: RequestOpt = {
    type: 'TEXT',
    headers: {
      g_tk: '0',
      format: 'jsonp',
      callback: 'callback',
      jsonpCallback: 'callback',
      loginUin: '5381',
      hostUin: '0',
      inCharset: 'utf8',
      outCharset: 'utf-8',
      notice: '0',
      platform: 'yqq',
      needNewCode: '0',
      new_json: '1',
      referer: 'https://y.qq.com/portal/player.html',
      'user-agent': randomUserAgent()
    },
    timeout: 5000,
    data
  };
  let req = await net<any>(url, params).catch(() => {
    return null;
  });
  if (!req) {
    return {
      status: false,
      msg: '请求无结果'
    };
  }
  try {
    req = JSON.parse(req);
  } catch (e) {}
  if (req.code === 0) {
    return req;
  }
  // 是否有回调
  let hasCallback = false;
  const callbackArr = ['callback', 'jsonCallback', 'MusicJsonCallback'];
  callbackArr.forEach((item) => {
    if (req.toString().trim().startsWith(item)) {
      const regex = new RegExp(item + '\\(([\\s\\S]*)\\)');
      const match = req.match(regex);
      req = JSON.parse(match[1]);
      hasCallback = true;
    }
  });
  if (!hasCallback) {
    return {
      status: false,
      msg: req
    };
  }
  if (req.code !== 0) {
    return {
      status: false,
      msg: req
    };
  }
  return req;
}

export function getMusicInfo(info: any) {
  const file = info.file;
  return {
    album: {
      id: info.album.id,
      name: info.album.name,
      cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${info.album.mid}.jpg`
    },
    artists: info.singer.map((singer: { [key: string]: any }) => {
      return {
        id: singer.id,
        name: singer.name
      };
    }),
    name: info.title,
    link: `https://y.qq.com/n/yqq/song/${info.mid}.html`,
    id: info.id,
    cp: info.action.msg === 3 || !info.interval,
    dl: !info.pay.pay_down,
    quality: {
      192: Boolean(file.size_aac || file.size_192aac || file.size_ogg || file.size_192ogg),
      320: Boolean(file.size_320 || file.size_320mp3),
      999: Boolean(info.file.size_flac)
    },
    mv: info.mv.vid || null,
    vendor: 'qq'
  };
}

export const getMusicInfo2 = (info: any) => {
  return {
    album: {
      id: info.albumid,
      name: info.albumname,
      cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${info.albummid}.jpg`
    },
    songTime: info.interval,
    artists: info.singer.map((singer: { [key: string]: any }) => {
      return {
        id: singer.id,
        name: singer.name
      };
    }),
    name: info.songname,
    link: `https://y.qq.com/n/yqq/song/${info.songmid}.html`,
    id: info.songid,
    cp: info.msgid === 3 || !info.interval,
    dl: !info.pay.paydownload,
    quality: {
      192: Boolean(info.sizeogg),
      320: Boolean(info.size320),
      999: Boolean(info.sizeflac)
    },
    mv: info.vid || null,
    vendor: 'qq'
  };
};
