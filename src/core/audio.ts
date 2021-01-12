import {readFile} from "@/lib/file";
import {SongType, AudiosOpt} from "@/core";

export interface PlayOpt {
    id: number, //当前歌曲id
    name: string; //歌曲名称
    cover: string; //歌曲图片
    singer: string; //歌手
    vendor: string; //歌曲来源
    path?: string; //歌曲链接
}

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
    }

    clear() {
        AudiosOpt.paused = 0;
        AudiosOpt.cachedType = 0;
        AudiosOpt.cachedTime = 0;
        AudiosOpt.ingTime = 0;
        AudiosOpt.allTime = 0;
    }

    async play(song?: PlayOpt) {
        return new Promise(async (resolve) => {
            if (song) song.path = await pathToSrc(song.path);
            if (!song || !song.path) {
                if (this.currentAudio.src && AudiosOpt.paused === 0) await this.currentAudio.play();//播放
                resolve(1);
                return;
            }

            if (song.path === this.currentAudio.src) {
                if (this.currentAudio.src && AudiosOpt.paused === 0) await this.currentAudio.play();//播放
                resolve(1);
                return;
            }
            this.clear();
            AudiosOpt.songInfo = song;
            this.currentAudio.src = song.path;
            this.currentAudio.load();

            this.currentAudio.oncanplay = (ev) => { //可以开始播放
                this.currentAudio.play();//播放
            }

            this.currentAudio.oncanplaythrough = (ev) => { //当前歌曲缓存完毕
                this.cached();
            }

            this.currentAudio.ondurationchange = (ev) => { //可获得歌曲时长
                AudiosOpt.allTime = this.currentAudio.duration;
                console.log(AudiosOpt.allTime)
            }

            this.currentAudio.onplay = (ev) => {//开始播放
                console.log('开始播放');
                this.gainNode.gain.value = 0;//设置音量为0
                this.currentTime(AudiosOpt.ingTime);//设置当前播放位置
                this.gainNode.gain.linearRampToValueAtTime(AudiosOpt.volume, this.AudioContext.currentTime + AudiosOpt.volumeGradualTime); //音量淡入
                AudiosOpt.paused = 1;
                resolve(1);
            }

            this.currentAudio.ontimeupdate = (ev) => {//更新播放位置
                AudiosOpt.ingTime = this.currentAudio.currentTime;
                if (AudiosOpt.cachedType !== 1) this.cached();
            }

            this.currentAudio.onpause = (ev) => {//播放暂停
                console.log('播放暂停')
                AudiosOpt.paused = 0;
            }

            this.currentAudio.onended = (ev) => {//播放完毕
                console.log('播放完毕')
                AudiosOpt.paused = 0;
                AudiosOpt.cachedType = 0;
                AudiosOpt.cachedTime = 0;
                AudiosOpt.ingTime = 0;
            }
        })
    }

    async pause() {
        return new Promise((resolve, reject) => {
            this.gainNode.gain.linearRampToValueAtTime(0, this.AudioContext.currentTime + AudiosOpt.volumeGradualTime); //音量淡出
            setTimeout(() => {
                this.currentAudio.pause();
                resolve(0);
            }, AudiosOpt.volumeGradualTime * 1000);
        })
    }

    //设置播放位置(暂停情况下)
    currentIngTime(e: number) {
        if (this.currentAudio) AudiosOpt.ingTime = e;
    }

    //设置播放位置(播放情况下)
    currentTime(e: number) {
        if (this.currentAudio) {
            this.gainNode.gain.value = 0;//设置音量为0
            this.currentAudio.currentTime = e;
            this.gainNode.gain.linearRampToValueAtTime(AudiosOpt.volume, this.AudioContext.currentTime + AudiosOpt.volumeGradualTime); //音量淡入
        }
    }

    //设置音量 1-100
    setVolume(e: number) {
        let s = (e / 100).toFixed(2);
        if (this.currentAudio && this.gainNode) this.gainNode.gain.value = AudiosOpt.volume = Number(s);
        else AudiosOpt.volume = Number(s);
    }

    //是否单曲循环
    loop(e: boolean) {
        if (this.currentAudio) this.currentAudio.loop = e;
    }

    //缓存
    cached() {
        if (this.currentAudio && this.currentAudio.buffered.length > 0) {
            AudiosOpt.cachedTime = this.currentAudio.buffered.end(this.currentAudio.buffered.length - 1); //已缓存时长
            AudiosOpt.cachedType = this.currentAudio.buffered.end(this.currentAudio.buffered.length - 1) / this.currentAudio.duration; //缓存进度  0-1
        }
    }

    //显示时间为分钟
    showTime(s: number) {
        let t: string = Number(s).toFixed(0);
        return Math.floor(Number(t) / 60) + ' : ' + Number(t) % 60;
    }
}

export const audio = Audios.getInstance();
