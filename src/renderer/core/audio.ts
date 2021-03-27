import { readFile } from '@/lib/file';
import {
  SongType,
  audioPlayListData,
  audioData,
  SongOpt,
  PlayTypeOpt
} from '@/renderer/core/index';
import { getSongUrl } from '@/lib/musicapi';
import { isNull, random } from '@/lib';

async function pathToSrc(path: string) {
  try {
    if (path.indexOf('http://') === -1 && path.indexOf('https://') === -1) {
      for (let i of SongType) {
        if (path.indexOf(i) > -1) {
          let req = await readFile(path, { encoding: 'base64' });
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
  public LastOrNext: number = null; //上一曲为负 下一曲为正
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
    this.currentAudio.crossOrigin = 'anonymous'; //音源跨域
    this.gainNode = this.AudioContext.createGain(); //创建控制节点
    this.sourceAudio = this.AudioContext.createMediaElementSource(this.currentAudio); //挂在音乐源
    this.analyser = this.AudioContext.createAnalyser();
    this.analyser.fftSize = 512; //精度
    this.sourceAudio.connect(this.analyser); //链接音频可视化
    this.sourceAudio.connect(this.gainNode); //链接音量控制节点
    this.gainNode.connect(this.AudioContext.destination); //链接音乐通道
    this.onAudio();
  }

  onAudio() {
    this.currentAudio.onerror = () => {
      console.log('错误');
      this.skip();
    };

    this.currentAudio.oncanplay = () => {
      //可以开始播放
      this.currentAudio.play().catch(() => {
        console.log('错误');
        this.skip();
      });
    };

    this.currentAudio.oncanplaythrough = () => {
      //当前歌曲缓存完毕
      this.cached();
    };

    this.currentAudio.ondurationchange = () => {
      //可获得歌曲时长
      audioData.allTime = this.currentAudio.duration;
    };

    this.currentAudio.onplay = () => {
      //开始播放
      this.gainNode.gain.value = 0; //设置音量为0
      this.currentTime(audioData.ingTime); //设置当前播放位置
      this.gainNode.gain.linearRampToValueAtTime(
        audioData.volume,
        this.AudioContext.currentTime + audioData.volumeGradualTime
      ); //音量淡入
      audioData.paused = 0;
    };

    this.currentAudio.ontimeupdate = () => {
      //更新播放位置
      audioData.ingTime = this.currentAudio.currentTime;
      if (audioData.cachedType !== 1) this.cached();
    };

    this.currentAudio.onpause = () => {
      //播放暂停
      audioData.paused = 1;
    };

    this.currentAudio.onended = () => {
      //播放完毕
      audioData.paused = 1;
      audioData.cachedType = 0;
      audioData.cachedTime = 0;
      audioData.ingTime = 0;
      this.next(1);
    };
  }

  clear() {
    audioData.paused = 1;
    audioData.cachedType = 0;
    audioData.cachedTime = 0;
    audioData.ingTime = 0;
    audioData.allTime = 0;
  }

  async play(song?: SongOpt) {
    if (song) {
      if (song.path) song.path = await pathToSrc(song.path);
      else {
        let req = await getSongUrl(song.vendor, song.id);
        if (req) song.path = req.url;
      }
      if (audioData.songInfo && song.id === audioData.songInfo.id && this.currentAudio.src) {
        if (audioData.paused === 1) this.currentAudio.play().catch(console.log);
        return;
      }
      this.clear();
      audioData.songInfo = song;
      this.currentAudio.src = song.path;
      this.currentAudio.load();
      if (isNull(audioPlayListData.value[`${song.vendor}|${song.id}`]))
        audioPlayListData.value[`${song.vendor}|${song.id}`] = song;
    } else if (this.currentAudio.src && audioData.paused === 1) {
      this.currentAudio.play().catch(console.log);
    } else if (!this.currentAudio.src && audioData.songInfo) {
      this.clear();
      let req = await getSongUrl(audioData.songInfo.vendor, audioData.songInfo.id);
      if (req) audioData.songInfo.path = req.url;
      this.currentAudio.src = audioData.songInfo.path;
      this.currentAudio.load();
    }
  }

  async pause() {
    return new Promise((resolve) => {
      this.gainNode.gain.linearRampToValueAtTime(
        0,
        this.AudioContext.currentTime + audioData.volumeGradualTime
      ); //音量淡出
      setTimeout(() => {
        this.currentAudio.pause();
        resolve(0);
      }, audioData.volumeGradualTime * 1000);
    });
  }

  async load() {
    let SongList = Object.keys(audioPlayListData.value);
    await this.play(audioPlayListData.value[SongList[0]]);
  }

  //跳过无资源歌曲
  skip() {
    audioData.paused = 1;
    audioData.cachedType = 0;
    audioData.cachedTime = 0;
    audioData.ingTime = 0;
    this.next(this.LastOrNext || 1).catch(console.log);
  }

  async next(num: number) {
    let SongIng = `${audioData.songInfo.vendor}|${audioData.songInfo.id}`;
    let SongList = Object.keys(audioPlayListData.value);
    let Index = SongList.indexOf(SongIng);
    this.LastOrNext = num;
    switch (audioData.playType) {
      case PlayTypeOpt.single: //单曲循环
        this.currentAudio.load();
        break;
      case PlayTypeOpt.list: //列表循环
        if (SongList.length === 0) return;
        if (SongList.length === 1) {
          this.currentAudio.load();
        } else if (Index + num > SongList.length - 1 || Index + num < 0) {
          await this.play(audioPlayListData.value[SongList[0]]);
        } else {
          await this.play(audioPlayListData.value[SongList[Index + num]]);
        }
        break;
      case PlayTypeOpt.random: //随机播放
        await this.play(audioPlayListData.value[SongList[random(0, SongList.length - 1)]]);
        break;
    }
  }

  //设置播放位置(暂停情况下)
  currentIngTime(e: number) {
    if (this.currentAudio) audioData.ingTime = e;
  }

  //设置播放位置(播放情况下)
  currentTime(e: number) {
    if (this.currentAudio) {
      this.gainNode.gain.value = 0; //设置音量为0
      this.currentAudio.currentTime = e;
      this.gainNode.gain.linearRampToValueAtTime(
        audioData.volume,
        this.AudioContext.currentTime + audioData.volumeGradualTime
      ); //音量淡入
    }
  }

  //设置音量 1-100
  setVolume(e: number) {
    let s = (e / 100).toFixed(2);
    if (this.currentAudio && this.gainNode) this.gainNode.gain.value = audioData.volume = Number(s);
    else audioData.volume = Number(s);
  }

  //是否单曲循环
  loop(e: boolean) {
    if (this.currentAudio) this.currentAudio.loop = e;
  }

  //缓存
  cached() {
    if (this.currentAudio && this.currentAudio.buffered.length > 0) {
      audioData.cachedTime = this.currentAudio.buffered.end(this.currentAudio.buffered.length - 1); //已缓存时长
      audioData.cachedType =
        this.currentAudio.buffered.end(this.currentAudio.buffered.length - 1) /
        this.currentAudio.duration; //缓存进度  0-1
    }
  }

  //显示时间为分钟
  showTime(s: number) {
    let t: string = Number(s).toFixed(0);
    return Math.floor(Number(t) / 60) + ' : ' + (Number(t) % 60);
  }
}

export const audio = Audios.getInstance();
