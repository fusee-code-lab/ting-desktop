import fetch, {RequestInit} from "node-fetch";
import {isNull} from "@/lib";
import querystring from "querystring";

const baseURL = 'https://c.y.qq.com'
const newURL = "https://u.y.qq.com";

export async function base(uri: string, data?: any, newApi: boolean = false) {
    const url = `${newApi ? newURL : baseURL}${uri}?${querystring.stringify(data)}`;
    let params: RequestInit = {
        headers: {
            g_tk: "0",
            format: 'jsonp',
            callback: 'callback',
            jsonpCallback: 'callback',
            loginUin: "5381",
            hostUin: "0",
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: "0",
            platform: 'yqq',
            needNewCode: "0",
            new_json: "1",
        },
        timeout: 5000
    };
    let req = await fetch(url, params)
        .then(res => res.text())
        .catch(() => {
            return null;
        })
    if (isNull(req)) {
        return {
            status: false,
            msg: '请求无结果'
        }
    }
    try {
        req = JSON.parse(req);
    } catch (e) {
    }
    if (req.code === 0) {
        return req;
    }
    // 是否有回调
    let hasCallback = false;
    const callbackArr = ['callback', 'jsonCallback', 'MusicJsonCallback'];
    callbackArr.forEach(item => {
        if (req.toString().trim().startsWith(item)) {
            const regex = new RegExp(item + '\\(([\\s\\S]*)\\)')
            const match = req.match(regex)
            req = JSON.parse(match[1])
            hasCallback = true
        }
    })
    if (!hasCallback) {
        return {
            status: false,
            msg: req
        }
    }
    if (req.code !== 0) {
        return {
            status: false,
            msg: req
        }
    }
    return req;
}