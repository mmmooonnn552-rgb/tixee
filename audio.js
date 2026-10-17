export class AudioEngine{
  constructor(){this.ctx=null;this.master=null;this.engine=null;this.enabled=false;}
  start(){
    if(this.enabled)return;
    this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=.09;this.master.connect(this.ctx.destination);
    const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type="sawtooth";o.frequency.value=70;g.gain.value=.0;o.connect(g).connect(this.master);o.start();this.engine={o,g};this.enabled=true;
  }
  update(speed,rpm){
    if(!this.enabled)return;
    const t=this.ctx.currentTime;this.engine.o.frequency.setTargetAtTime(55+rpm*.035,t,.05);this.engine.g.gain.setTargetAtTime(Math.min(.12,.01+speed/900),t,.06);
  }
  beep(freq=440,dur=.08){
    if(!this.enabled)return;const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.frequency.value=freq;g.gain.value=.05;o.connect(g).connect(this.master);o.start();g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+dur);o.stop(this.ctx.currentTime+dur);
  }
}
