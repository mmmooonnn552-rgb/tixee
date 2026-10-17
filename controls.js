export class Controls{
  constructor(){
    this.keys={};this.touch={left:false,right:false,gas:false,brake:false,handbrake:false};
    addEventListener("keydown",e=>{this.keys[e.code]=true;if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code))e.preventDefault()});
    addEventListener("keyup",e=>this.keys[e.code]=false);
    document.querySelectorAll("[data-control]").forEach(b=>{
      const k=b.dataset.control, on=e=>{e.preventDefault();this.touch[k]=true}, off=e=>{e.preventDefault();this.touch[k]=false};
      b.addEventListener("pointerdown",on);b.addEventListener("pointerup",off);b.addEventListener("pointercancel",off);b.addEventListener("pointerleave",off);
    });
  }
  get left(){return !!(this.keys.KeyA||this.keys.ArrowLeft||this.touch.left)}
  get right(){return !!(this.keys.KeyD||this.keys.ArrowRight||this.touch.right)}
  get gas(){return !!(this.keys.KeyW||this.keys.ArrowUp||this.touch.gas)}
  get brake(){return !!(this.keys.KeyS||this.keys.ArrowDown||this.touch.brake)}
  get handbrake(){return !!(this.keys.Space||this.touch.handbrake)}
}
