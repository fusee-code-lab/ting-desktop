import {session} from "electron";
import {random} from "@/lib";

function randomString(pattern: string, length: number) {
    return Array.apply(null, {length: length}).map(() => (pattern[Math.floor(Math.random() * pattern.length)])).join('')
}

export function completeCookie(cookie?: string) {
    let origin = (cookie || '').split(/;\s*/).map(element => (element.split('=')[0])), extra = []
    let now = (new Date).getTime()

    if (!origin.includes('JSESSIONID-WYYY')) {
        let expire = new Date(now + 1800000) //30 minutes
        let jessionid = randomString('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ\\/+', 176) + ':' + expire.getTime()
        extra.push(['JSESSIONID-WYYY=' + jessionid, 'Expires=' + expire.toUTCString()])
    }
    if (!origin.includes('_iuqxldmzr_')) {
        let expire = new Date(now + 157680000000) //5 years
        extra.push(['_iuqxldmzr_=32', 'Expires=' + expire.toUTCString()])
    }
    if ((!origin.includes('_ntes_nnid')) || (!origin.includes('_ntes_nuid'))) {
        let expire = new Date(now + 3153600000000) //100 years
        let nnid = randomString('0123456789abcdefghijklmnopqrstuvwxyz', 32) + ',' + now
        extra.push(['_ntes_nnid=' + nnid, 'Expires=' + expire.toUTCString()])
        extra.push(['_ntes_nuid=' + nnid.slice(0, 32), 'Expires=' + expire.toUTCString()])
    }

    return extra.map(x => x[0]).join('; ')
}

export function randomUserAgent() {
    const userAgentList = [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0',
        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
        'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
        'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
        'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)',
        'Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586',
        'Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1'
    ]
    return userAgentList[random(0, userAgentList.length)]
}

export function sessionInit() {
    session.defaultSession.webRequest.onBeforeSendHeaders({
        urls: [
            "https://c.y.qq.com/*",
            "https://music.163.com/*"
        ]
    }, (details, callback) => {
        if (details.url.indexOf("https://c.y.qq.com/") === 0) {
            details.requestHeaders["user-agent"] = randomUserAgent();
            details.requestHeaders["referer"] = "https://y.qq.com/portal/player.html";
        } else if (details.url.indexOf("https://music.163.com/") === 0) {
            if (details.requestHeaders["user-agent"] === "linuxapi") details.requestHeaders["user-agent"] = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36";
            else details.requestHeaders["user-agent"] = randomUserAgent();
            details.requestHeaders["referer"] = "http://music.163.com";
            details.requestHeaders["Host"] = "music.163.com";
            details.requestHeaders["Cookie"] = completeCookie();
        }
        callback({requestHeaders: details.requestHeaders});
    })
}