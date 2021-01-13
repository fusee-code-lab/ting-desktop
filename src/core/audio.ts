import {readFile} from "@/lib/file";
import {SongType, TingCfg, SongOpt} from "@/core";

async function pathToSrc(path: string) {
    try {
        if (path.indexOf("http://") === -1 && path.indexOf("https://") === -1) {
            for (let i of SongType) {
                if (path.indexOf(i) > -1) {
                    let req = await readFile(path, {encoding: "base64"});
                    if (req === 0) return null;
                    return `data:audio/${i};base64,` + req;
                }
            }
        } else return path;
    } catch (e) {
        return null;
    }
}

class Audios {
    public static instance: Audios;
    public analyser: AnalyserNode = null; //音频的可视化
    private AudioContext: AudioContext = new AudioContext(); //音频api
    private currentAudio: HTMLAudioElement = new Audio(); //当前播放音源
    private sourceAudio: MediaElementAudioSourceNode = null; //音频的源
    private gainNode: GainNode = null; //控制节点

    static getInstance() {
        if (!Audios.instance) Audios.instance = new Audios();
        return Audios.instance;
    }

    constructor() {
        this.currentAudio.crossOrigin = "anonymous"; //音源跨域
        this.gainNode = this.AudioContext.createGain(); //创建控制节点
        this.sourceAudio = this.AudioContext.createMediaElementSource(this.currentAudio); //挂在音乐源
        this.analyser = this.AudioContext.createAnalyser();
        this.analyser.fftSize = 512; //精度
        this.sourceAudio.connect(this.analyser);//链接音频可视化
        this.sourceAudio.connect(this.gainNode);//链接音量控制节点
        this.gainNode.connect(this.AudioContext.destination);//链接音乐通道
        this.onAudio();
    }

    onAudio() {
        this.currentAudio.oncanplay = () => { //可以开始播放
            this.currentAudio.play();
        }

        this.currentAudio.oncanplaythrough = () => { //当前歌曲缓存完毕
            this.cached();
        }

        this.currentAudio.ondurationchange = () => { //可获得歌曲时长
            TingCfg.audio.allTime = this.currentAudio.duration;
        }

        this.currentAudio.onplay = () => {//开始播放
            this.gainNode.gain.value = 0;//设置音量为0
            this.currentTime(TingCfg.audio.ingTime);//设置当前播放位置
            this.gainNode.gain.linearRampToValueAtTime(TingCfg.audio.volume, this.AudioContext.currentTime + TingCfg.audio.volumeGradualTime); //音量淡入
            TingCfg.audio.paused = 1;
        }

        this.currentAudio.ontimeupdate = () => {//更新播放位置
            TingCfg.audio.ingTime = this.currentAudio.currentTime;
            if (TingCfg.audio.cachedType !== 1) this.cached();
        }

        this.currentAudio.onpause = () => {//播放暂停
            TingCfg.audio.paused = 0;
        }

        this.currentAudio.onended = () => {//播放完毕
            TingCfg.audio.paused = 0;
            TingCfg.audio.cachedType = 0;
            TingCfg.audio.cachedTime = 0;
            TingCfg.audio.ingTime = 0;
        }
    }

    clear() {
        TingCfg.audio.paused = 0;
        TingCfg.audio.cachedType = 0;
        TingCfg.audio.cachedTime = 0;
        TingCfg.audio.ingTime = 0;
        TingCfg.audio.allTime = 0;
    }

    play(song?: SongOpt) {
        return new Promise(async (resolve) => {
            if (song) {
                if (song.path) song.path = await pathToSrc(song.path);
                if (song.path === this.currentAudio.src) {
                    if (this.currentAudio.src && TingCfg.audio.paused === 0) await this.currentAudio.play();//播放
                    resolve(1);
                    return;
                }
                this.clear();
                TingCfg.audio.songInfo = song;
                this.currentAudio.src = song.path;
                this.currentAudio.load();
            } else if (TingCfg.audio.songInfo) {
                this.clear();
                this.currentAudio.src = TingCfg.audio.songInfo.path;
                this.currentAudio.load();
            }
        })
    }

    async pause() {
        return new Promise((resolve) => {
            this.gainNode.gain.linearRampToValueAtTime(0, this.AudioContext.currentTime + TingCfg.audio.volumeGradualTime); //音量淡出
            setTimeout(() => {
                this.currentAudio.pause();
                resolve(0);
            }, TingCfg.audio.volumeGradualTime * 1000);
        })
    }

    //设置播放位置(暂停情况下)
    currentIngTime(e: number) {
        if (this.currentAudio) TingCfg.audio.ingTime = e;
    }

    //设置播放位置(播放情况下)
    currentTime(e: number) {
        if (this.currentAudio) {
            this.gainNode.gain.value = 0;//设置音量为0
            this.currentAudio.currentTime = e;
            this.gainNode.gain.linearRampToValueAtTime(TingCfg.audio.volume, this.AudioContext.currentTime + TingCfg.audio.volumeGradualTime); //音量淡入
        }
    }

    //设置音量 1-100
    setVolume(e: number) {
        let s = (e / 100).toFixed(2);
        if (this.currentAudio && this.gainNode) this.gainNode.gain.value = TingCfg.audio.volume = Number(s);
        else TingCfg.audio.volume = Number(s);
    }

    //是否单曲循环
    loop(e: boolean) {
        if (this.currentAudio) this.currentAudio.loop = e;
    }

    //缓存
    cached() {
        if (this.currentAudio && this.currentAudio.buffered.length > 0) {
            TingCfg.audio.cachedTime = this.currentAudio.buffered.end(this.currentAudio.buffered.length - 1); //已缓存时长
            TingCfg.audio.cachedType = this.currentAudio.buffered.end(this.currentAudio.buffered.length - 1) / this.currentAudio.duration; //缓存进度  0-1
        }
    }

    //显示时间为分钟
    showTime(s: number) {
        let t: string = Number(s).toFixed(0);
        return Math.floor(Number(t) / 60) + ' : ' + Number(t) % 60;
    }
}

export const audio = Audios.getInstance();
