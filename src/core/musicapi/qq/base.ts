import {instance, randomUserAgent, isBrowser} from '../util'

const getACSRFToken = function (cookie: any) {
    function e(e: any) {
        for (var n = 5381, o = 0, t = e.length; t > o; ++o)
            n += (n << 5) + e.charCodeAt(o);
        return 2147483647 & n
    }

    return e(cookie)
}

export function Base() {
    const fly = instance()
    // fly.config.proxy = 'http://localhost:8888'
    fly.config.baseURL = 'https://c.y.qq.com'
    fly.config.timeout = 5000
    fly.config.parseJson = false
    fly.config.headers = {
        Referer: 'https://y.qq.com/portal/player.html',
        'User-Agent': randomUserAgent()
    }
    fly.config.rejectUnauthorized = false

    fly.interceptors.request.use((config: { [key: string]: any }) => {
        if (config.newApi) {
            config.baseURL = 'https://u.y.qq.com'
            delete config.newApi
        }
        // 浏览器且本地有cookie信息 接口就都带上cookie
        let loginUin = 0
        let g_tk = 5381
        if (isBrowser) {
            const loginCookies = window.localStorage.getItem('@suen/music-api-qq-login-cookie')
            if (loginCookies) {
                try {
                    config.headers.Cookie = loginCookies
                    const cookiesObject: { [key: string]: any } = {}
                    loginCookies.replace(/\s*/g, '').split(';').map(item => item.split('=')).forEach(item => {
                        cookiesObject[item[0]] = item[1]
                    })
                    loginUin = cookiesObject['uin'].substring(2)
                    g_tk = getACSRFToken(cookiesObject["p_skey"] || cookiesObject["skey"] || cookiesObject["p_lskey"] || cookiesObject["lskey"])
                } catch (e) {
                    console.warn(e)
                }
            }
        }
        config.body = Object.assign({}, {
            g_tk,
            format: 'jsonp',
            callback: 'callback',
            jsonpCallback: 'callback',
            loginUin,
            hostUin: 0,
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq',
            needNewCode: 0,
            new_json: 1,
        }, config.body)
        return config
    }, (e: any) => Promise.reject(e))
    fly.interceptors.response.use((res: any) => {
        if (!res.data) {
            return Promise.reject({
                status: false,
                msg: '请求无结果'
            })
        }
        // 是否有回调
        let hasCallback = false
        const callbackArr = ['callback', 'jsonCallback', 'MusicJsonCallback']
        callbackArr.forEach(item => {
            if (res.data.toString().trim().startsWith(item)) {
                const regex = new RegExp(item + '\\(([\\s\\S]*)\\)')
                const match = res.data.match(regex)
                res.data = JSON.parse(match[1])
                hasCallback = true
            }
        })
        if (!hasCallback) {
            return Promise.reject({
                status: false,
                msg: res.data
            })
        }
        // code是否正确
        if (!res.request.nocode && res.data.code !== 0) {
            return Promise.reject({
                status: false,
                msg: res.data
            })
        }
        return res.data
    }, (e: any) => {
        return Promise.reject({
            status: false,
            msg: e
        })
    })
    return fly
}