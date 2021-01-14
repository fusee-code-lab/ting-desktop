import {instance, randomUserAgent, completeCookie, isBrowser} from '../util'
import querystring from 'querystring'
import crypto from 'crypto';

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

export function Base() {
    const fly = instance()
    // fly.config.proxy = 'http://localhost:8888'
    fly.config.baseURL = 'https://music.163.com'
    fly.config.timeout = 5000
    fly.config.headers = {
        Accept: '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
        Connection: 'keep-alive',
        // 'X-Real-IP': '223.74.158.213', // 此处加上可以解决海外请求的问题
        'Content-Type': 'application/x-www-form-urlencoded',
        Referer: 'http://music.163.com',
        Host: 'music.163.com',
        'User-Agent': randomUserAgent(),
        Cookie: completeCookie()
    }
    fly.config.rejectUnauthorized = false

    fly.interceptors.request.use((config: { [key: string]: any }) => {
        if (config.pureFly) return config
        // 浏览器且本地有cookie信息 接口就都带上cookie
        if (isBrowser) {
            const loginCookies = window.localStorage.getItem('@suen/music-api-netease-login-cookie')
            if (loginCookies) {
                config.headers.Cookie = loginCookies
            }
        }
        let data
        if (config.crypto === 'linuxapi') {
            data = linuxapi({
                method: config.method,
                url: config.baseURL + config.url.replace(/\w*api/, 'api'),
                params: config.body
            })
            config.headers['User-Agent'] = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36'
            config.url = '/api/linux/forward'
        } else {
            const cryptoreq = weapi(config.body)
            data = {
                params: cryptoreq.params,
                encSecKey: cryptoreq.encSecKey
            }
        }
        config.body = querystring.stringify(data)
        return config
    }, (e: any) => Promise.reject(e))
    fly.interceptors.response.use((res: any) => {
        if (res.request.pureFly) {
            return res
        }
        if (!res.data) {
            return Promise.reject({
                status: false,
                msg: '请求无结果'
            })
        }
        const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
        if (data.code !== 200) {
            return Promise.reject({
                status: false,
                msg: '请求失败',
                log: res.data
            })
        }
        return data
    }, (e: any) => Promise.reject(e))

    return fly
}