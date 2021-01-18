import fetch, {RequestInit} from "node-fetch";
import crypto from 'crypto';
import querystring from 'querystring'
import {isNull} from "@/lib";

const iv = Buffer.from('0102030405060708')
const presetKey = Buffer.from('0CoJUm6Qyw8W8jud')
const linuxapiKey = Buffer.from('rFgB&h#%2?^eDg:Q')
const base62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const publicKey = '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB\n-----END PUBLIC KEY-----'

const aesEncrypt = (buffer: Buffer, mode: string, key: Uint8Array | Buffer, iv: string | Buffer) => {
    const cipher = crypto.createCipheriv('aes-128-' + mode, key, iv)
    return Buffer.concat([cipher.update(buffer), cipher.final()])
}

const rsaEncrypt = (buffer: Uint8Array | Buffer, key: string | Buffer) => {
    const RSA_NO_PADDING = crypto.constants ? crypto.constants.RSA_NO_PADDING : 3
    buffer = Buffer.concat([Buffer.alloc(128 - buffer.length), Buffer.from(buffer)])
    return crypto.publicEncrypt({key: key, padding: RSA_NO_PADDING}, buffer)
}

const weapi = (object: object) => {
    const text = JSON.stringify(object)
    // @ts-ignore
    const secretKey = crypto.randomBytes(16).map(n => (base62.charAt(n % 62).charCodeAt()))
    return {
        params: aesEncrypt(Buffer.from(aesEncrypt(Buffer.from(text), 'cbc', presetKey, iv).toString('base64')), 'cbc', secretKey, iv).toString('base64'),
        encSecKey: rsaEncrypt(secretKey.reverse(), publicKey).toString('hex')
    }
}

const linuxapi = (object: object) => {
    const text = JSON.stringify(object)
    return {
        eparams: aesEncrypt(Buffer.from(text), 'ecb', linuxapiKey, '').toString('hex').toUpperCase()
    }
}

const baseURL = 'https://music.163.com';


export async function base(uri: string, method: string, data?: any, opt?: { pureFly: boolean; crypto: string; }) {
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
        })
        uri = '/api/linux/forward';
    } else {
        const cryptoreq = weapi(data)
        body = {
            params: cryptoreq.params,
            encSecKey: cryptoreq.encSecKey
        }
    }
    params.body = querystring.stringify(body);
    const url = `${baseURL}${uri}`;

    let req = await fetch(url, params)
        .then(res => res.text())
        .catch(() => {
            return null;
        });

    if (opt && opt.pureFly) {
        return req
    }
    if (isNull(req)) {
        return {
            status: false,
            msg: '请求无结果'
        }
    }
    const res = typeof req === 'string' ? JSON.parse(req) : req;
    if (res.code !== 200) {
        return {
            status: false,
            msg: '请求失败'
        }
    }
    return res;
}