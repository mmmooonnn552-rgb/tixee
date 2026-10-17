export class UI{
  constructor(){this.speed=document.querySelector("#speed");this.gear=document.querySelector("#gear");this.rpm=document.querySelector("#rpm");this.dir=document.querySelector("#direction");this.cam=document.querySelector("#cameraBtn");this.panel=document.querySelector("#pausePanel");}
  update(v){this.speed.textContent=Math.round(v.speed);this.rpm.textContent=Math.round(v.rpm);this.gear.textContent=v.gear;this.dir.textContent=`${v.heading} • شارع المدينة`;this.cam.textContent=`CAM • ${v.camera+1}`}
  pause(p){this.panel.classList.toggle("hidden",!p)}
}
