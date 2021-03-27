import fetch, { RequestInit } from 'node-fetch';
import crypto from 'crypto';
import querystring from 'querystring';
import { isNull } from '@/lib';
import { completeCookie, randomUserAgent } from '@/lib/musicapi/util';

const iv = Buffer.from('0102030405060708');
const presetKey = Buffer.from('0CoJUm6Qyw8W8jud');
const linuxapiKey = Buffer.from('rFgB&h#%2?^eDg:Q');
const base62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const publicKey =
  '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB\n-----END PUBLIC KEY-----';

const aesEncrypt = (
  buffer: Buffer,
  mode: string,
  key: Uint8Array | Buffer,
  iv: string | Buffer
) => {
  const cipher = crypto.createCipheriv('aes-128-' + mode, key, iv);
  return Buffer.concat([cipher.update(buffer), cipher.final()]);
};

const rsaEncrypt = (buffer: Uint8Array | Buffer, key: string | Buffer) => {
  const RSA_NO_PADDING = crypto.constants ? crypto.constants.RSA_NO_PADDING : 3;
  buffer = Buffer.concat([Buffer.alloc(128 - buffer.length), Buffer.from(buffer)]);
  return crypto.publicEncrypt({ key: key, padding: RSA_NO_PADDING }, buffer);
};

const weapi = (object: object) => {
  const text = JSON.stringify(object);
  // @ts-ignore
  const secretKey = crypto.randomBytes(16).map((n) => base62.charAt(n % 62).charCodeAt());
  return {
    params: aesEncrypt(
      Buffer.from(aesEncrypt(Buffer.from(text), 'cbc', presetKey, iv).toString('base64')),
      'cbc',
      secretKey,
      iv
    ).toString('base64'),
    encSecKey: rsaEncrypt(secretKey.reverse(), publicKey).toString('hex')
  };
};

const linuxapi = (object: object) => {
  const text = JSON.stringify(object);
  return {
    eparams: aesEncrypt(Buffer.from(text), 'ecb', linuxapiKey, '').toString('hex').toUpperCase()
  };
};

const baseURL = 'https://music.163.com';

export async function base(
  uri: string,
  method: string,
  data?: any,
  opt?: { pureFly?: boolean; crypto?: string }
) {
  let params: RequestInit = {
    method,
    headers: {
      Accept: '*/*',
      'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
      Connection: 'keep-alive',
      // 'X-Real-IP': '223.74.158.213', // 此处加上可以解决海外请求的问题
      'Content-type': 'application/x-www-form-urlencoded',
      'User-Agent': opt && opt.crypto
    },
    timeout: 5000
  };

  let body;
  if (opt && opt.crypto === 'linuxapi') {
    body = linuxapi({
      method: method,
      url: baseURL + uri.replace(/\w*api/, 'api'),
      params: data
    });
    uri = '/api/linux/forward';
  } else {
    const cryptoreq = weapi(data);
    body = {
      params: cryptoreq.params,
      encSecKey: cryptoreq.encSecKey
    };
  }
  params.body = querystring.stringify(body);
  const url = `${baseURL}${uri}`;

  let req = await fetch(url, params)
    .then((res) => res.text())
    .catch(() => {
      return null;
    });

  if (opt && opt.pureFly) {
    return req;
  }
  if (isNull(req)) {
    return {
      status: false,
      msg: '请求无结果'
    };
  }
  const res = typeof req === 'string' ? JSON.parse(req) : req;
  if (res.code !== 200) {
    return {
      status: false,
      msg: '请求失败'
    };
  }
  return res;
}

// getRestrictLevel方法 来源于网易云音乐web端代码
export function getRestrictLevel(bm5r: any, fC7v: any) {
  if (!bm5r) return 0;
  if (bm5r.program) return 0;
  if (fC7v) {
    if (fC7v.st != null && fC7v.st < 0) return 100;
    if (fC7v.fee > 0 && fC7v.fee != 8 && fC7v.payed == 0 && fC7v.pl <= 0) return 10;
    if (fC7v.fee == 16 || (fC7v.fee == 4 && fC7v.flag & 2048)) return 11;
    if ((fC7v.fee == 0 || fC7v.payed) && fC7v.pl > 0 && fC7v.dl == 0) return 1e3;
    if (fC7v.pl == 0 && fC7v.dl == 0) return 100;
    return 0;
  } else {
    if (bm5r.status >= 0) return 0;
    if (bm5r.fee > 0) return 10;
    return 100;
  }
}

// 来自网易云前端 l2x.qA8s
function qA8s(fB4F: any) {
  if (fB4F.st != null && fB4F.st < 0) return 100;
  if (fB4F.fee > 0 && fB4F.fee != 8 && fB4F.payed == 0 && fB4F.pl <= 0) return 10;
  if (fB4F.fee == 16 || (fB4F.fee == 4 && fB4F.flag & 2048)) return 11;
  if ((fB4F.fee == 0 || fB4F.payed) && fB4F.pl > 0 && fB4F.dl == 0) return 1e3;
  if (fB4F.pl == 0 && fB4F.dl == 0) return 100;
  return 0;
}

function disable(song: any, privilege: any) {
  return getRestrictLevel(song, privilege) === 100 || qA8s(privilege) === 10;
}

export function neteaseHeaders() {
  let url: string[] = [baseURL + '/*'];
  let headers: { [key: string]: { [key: string]: string } } = {
    'https://music.163.com': {
      referer: 'http://music.163.com',
      Host: 'music.163.com',
      Cookie: completeCookie(),
      'user-agent': randomUserAgent()
    }
  };
  return { url, headers };
}

export function getMusicInfo(info: any, privilege?: any) {
  if (!privilege) {
    privilege = info.privilege;
  }
  return {
    album: {
      id: info.al.id,
      name: info.al.name,
      cover: info.al.picUrl
    },
    artists: info.ar.map((ar: { [key: string]: any }) => {
      return {
        id: ar.id,
        name: ar.name
      };
    }),
    songTime: info.dt / 1000,
    name: info.name,
    link: `https://music.163.com/#/song?id=${info.id}`,
    id: info.id,
    cp: disable(info, privilege),
    dl: !privilege.fee,
    quality: {
      192: privilege.maxbr >= 192000,
      320: privilege.maxbr >= 320000,
      999: privilege.maxbr >= 999000
    },
    mv: info.mv || null,
    vendor: 'netease'
  };
}

export function getMusicInfo2(info: any, privilege?: any) {
  if (!privilege) {
    privilege = info.privilege;
  }
  return {
    album: {
      id: info.album.id,
      name: info.album.name,
      cover: info.album.picUrl
    },
    artists: info.artists.map((ar: { [key: string]: any }) => {
      return {
        id: ar.id,
        name: ar.name
      };
    }),
    name: info.name,
    link: `https://music.163.com/#/song?id=${info.id}`,
    id: info.id,
    cp: disable(info, privilege),
    dl: !privilege.fee,
    quality: {
      192: privilege.maxbr >= 192000,
      320: privilege.maxbr >= 320000,
      999: privilege.maxbr >= 999000
    },
    mv: info.mvid || null,
    vendor: 'netease'
  };
}
