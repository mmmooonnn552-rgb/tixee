import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import {AssetLoader} from "./assetLoader.js";
import {createPlayerCar,createTrafficCar} from "./vehicle.js";
import {createCity,CITY_LAYOUT} from "./city.js";
import {TrafficSystem} from "./traffic.js";
import {CameraRig} from "./camera.js";
import {Controls} from "./controls.js";
import {AudioEngine} from "./audio.js";
import {UI} from "./ui.js";

const game=document.querySelector("#game"),loading=document.querySelector("#loading"),hud=document.querySelector("#hud"),touch=document.querySelector("#touchControls"),help=document.querySelector("#help");
const scene=new THREE.Scene();scene.background=new THREE.Color(0x86b7d5);scene.fog=new THREE.Fog(0x86b7d5,150,480);
const camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.05,650);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;game.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xc5e8ff,0x5b5145,2.0));const sun=new THREE.DirectionalLight(0xfff1d0,3.0);sun.position.set(-90,140,60);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-220;sun.shadow.camera.right=220;sun.shadow.camera.top=220;sun.shadow.camera.bottom=-220;scene.add(sun);

const loader=new AssetLoader(),controls=new Controls(),audio=new AudioEngine(),ui=new UI();
let paused=false,last=performance.now(),speed=0,heading="N",camRig,player,traffic,city;

async function loadManifest(){const r=await fetch("assets/manifest.json");if(!r.ok)throw new Error("Cannot read assets/manifest.json");return await r.json();}
function showMissing(missing){const panel=document.querySelector("#assetPanel"),list=document.querySelector("#missingList");if(!missing.length){panel.classList.add("hidden");return;}list.innerHTML=missing.map(x=>`<li>${x}</li>`).join("");panel.classList.remove("hidden");}
function updateProgress(t){document.querySelector("#loadingText").textContent=t;}

async function boot(){
  try{
    updateProgress("فحص ملف Assets Manifest...");const manifest=await loadManifest();
    updateProgress("تحميل سيارة اللاعب GLB...");player=await createPlayerCar(loader);
    if(!player){ player=new THREE.Group(); player.name="MissingPlayerCarRoot"; console.warn("[ASSET MISSING] Player car is unavailable; continuing without visible player model."); }
    player.position.set(0,.02,20);scene.add(player);
    updateProgress("تحميل مدينة Cairo GLB...");city=await createCity(scene,loader,manifest);
    updateProgress("تحميل سيارات المرور GLB...");const trafficModels=[];for(const spec of manifest.trafficCars){const m=await createTrafficCar(loader,spec,trafficModels.length);if(m)trafficModels.push(m);}
    traffic=new TrafficSystem(scene,city,trafficModels);camRig=new CameraRig(camera,player);
    const missing=[...city.missing,...loader.missing];showMissing([...new Set(missing)]);
    loading.classList.add("hidden");hud.classList.remove("hidden");touch.classList.remove("hidden");help.classList.remove("hidden");requestAnimationFrame(loop);
  }catch(e){console.error(e);updateProgress("تعذر تشغيل اللعبة: تأكد من وجود player_car.glb وملفات الطرق الأساسية. راجع README.");document.querySelector("#loadingError").textContent=e.message;document.querySelector("#loadingError").classList.remove("hidden");}
}

function setPause(v){paused=v;ui.pause(v);}
document.querySelector("#cameraBtn").onclick=()=>{camRig.next();audio.beep(660,.05)};document.querySelector("#pauseBtn").onclick=()=>setPause(!paused);document.querySelector("#resumeBtn").onclick=()=>setPause(false);
addEventListener("keydown",e=>{if(e.code==="KeyC"&&camRig){camRig.next();audio.beep(660,.05)}if(e.code==="Escape")setPause(!paused)});renderer.domElement.addEventListener("pointerdown",()=>audio.start(),{once:true});addEventListener("keydown",()=>audio.start(),{once:true});

function drive(dt){const gas=controls.gas,brake=controls.brake,hand=controls.handbrake;const max=30;if(gas)speed=Math.min(max,speed+15*dt);else speed=Math.max(0,speed-4*dt);if(brake)speed=Math.max(0,speed-24*dt);if(hand)speed=Math.max(0,speed-35*dt);
  const steer=(controls.left?-1:0)+(controls.right?1:0);player.rotation.y+=steer*.62*(.25+Math.min(speed/max,1))*dt;player.position.add(new THREE.Vector3(0,0,-speed*dt).applyQuaternion(player.quaternion));
  const limit=CITY_LAYOUT.block*(CITY_LAYOUT.half+1)-10;player.position.x=THREE.MathUtils.clamp(player.position.x,-limit,limit);player.position.z=THREE.MathUtils.clamp(player.position.z,-limit,limit);
  for(const w of player.userData.wheels||[])w.rotation.x-=speed*dt/(player.userData.wheelRadius||.34);
  const rpm=800+speed*160+(gas?900:0),gear=speed<.5?"N":speed<7?"1":speed<14?"2":speed<21?"3":"4";const ang=((player.rotation.y%(Math.PI*2))+Math.PI*2)%(Math.PI*2);heading=ang<.785||ang>5.5?"N":ang<2.35?"W":ang<3.92?"S":"E";return {speed:speed*3.6,rpm,gear};}
function loop(now){const dt=Math.min(.033,(now-last)/1000);last=now;if(!paused){const v=drive(dt);traffic?.update(dt,player);camRig?.update(dt);audio.update(v.speed,v.rpm);ui.update({...v,camera:camRig?.mode||0,heading});}renderer.render(scene,camera);requestAnimationFrame(loop)}
addEventListener("resize",()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
boot();
