import {instance, randomUserAgent} from '../util'

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