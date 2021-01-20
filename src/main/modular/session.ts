import {ipcMain, session} from "electron";
import {qqHeaders} from "@/lib/musicapi/qq/base";
import {neteaseHeaders} from "@/lib/musicapi/netease/base";

const qq = qqHeaders();
const netease = neteaseHeaders();

/**
 * 监听
 */
export class Session {

    /**
     * urls列表
     */
    public urls: string[] = [...qq.url, ...netease.url];

    /**
     * 头部 headers
     */
    public urlHeaders: { [key: string]: { [key: string]: string } } = {...qq.headers, ...netease.headers}

    constructor() {
    }

    /**
     * 拦截监听指定url请求并更换指定headers
     */
    webRequest() {
        session.defaultSession.webRequest.onBeforeSendHeaders({
            urls: this.urls
        }, (details, callback) => {
            const urls = Object.keys(this.urlHeaders);
            const keys = urls.filter((key: string) => {
                return details.url.indexOf(key) === 0;
            })
            for (let key of keys) {
                for (let v in this.urlHeaders[key]) {
                    details.requestHeaders[v] = this.urlHeaders[key][v];
                }
            }
            callback({requestHeaders: details.requestHeaders});
        });
    }

    /**
     * 设置setUserAgent/acceptLanguages
     * @param userAgent
     * @param acceptLanguages
     */
    setUserAgent(userAgent: string, acceptLanguages?: string) {
        session.defaultSession.setUserAgent(userAgent, acceptLanguages);
    }

    /**
     * 开启监听
     */
    on() {
        this.webRequest();
        //设置headers
        ipcMain.on("session-set-headers", async (event, args) => {
            this.urlHeaders = args;
        });
    }

}
