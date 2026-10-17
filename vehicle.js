import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import {findWheels,setModelScaleToHeight} from "./assetLoader.js";

export async function createPlayerCar(loader){
  const car=await loader.load("assets/models/cars/player_car.glb");
  if(!car){ console.warn("[ASSET MISSING] assets/models/cars/player_car.glb"); return null; }
  setModelScaleToHeight(car,1.55);
  const wheels=findWheels(car);
  car.userData.wheels=wheels;car.userData.wheelRadius=.34;car.userData.kind="player";
  return car;
}

export async function createTrafficCar(loader,spec,colorIndex=0){
  const car=await loader.loadBest(spec); if(!car) return null;
  setModelScaleToHeight(car,spec.id==="microbus"?2.2:1.55);
  car.userData.wheels=findWheels(car);car.userData.wheelRadius=.34;car.userData.kind=spec.id;car.userData.colorIndex=colorIndex;
  // Prefer changing only explicitly named paint materials; never synthesize geometry.
  const colors=[0xf0f0ea,0x242932,0xb9342d,0xd4b625,0x277b57,0x6e55a5,0x758494];
  const wanted=colors[colorIndex%colors.length];
  car.traverse(o=>{if(o.isMesh && /body|paint|carpaint|exterior/i.test(o.name) && o.material?.color){o.material=o.material.clone();o.material.color.setHex(wanted);}});
  return car;
}
