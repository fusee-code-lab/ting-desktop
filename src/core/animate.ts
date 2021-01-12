import {audio} from "@/core/audio";

class Animate {
    private static instance: Animate;
    public waveform: Uint8Array = null;
    public frequency: Uint8Array = null;

    static getInstance() {
        if (!Animate.instance) Animate.instance = new Animate();
        return Animate.instance;
    }

    constructor() {
    }

    init(el: HTMLElement) {
        this.waveform = new Uint8Array(audio.analyser.frequencyBinCount);
        this.frequency = new Uint8Array(audio.analyser.frequencyBinCount);
    }

    refresh() {
        audio.analyser.getByteTimeDomainData(this.waveform);
        audio.analyser.getByteFrequencyData(this.frequency);
        console.log(this.waveform, this.frequency);
    }

}

export const animate = Animate.getInstance();

let animateRefreshNum: number = 0;

export function animateRefresh() {
    animateRefreshNum = requestAnimationFrame(animateRefresh);
    animate.refresh();
}

export function animateStop() {
    if (animateRefreshNum) cancelAnimationFrame(animateRefreshNum);
}