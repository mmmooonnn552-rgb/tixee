import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import {GLTFLoader} from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";

export class AssetLoader {
  constructor(){ this.loader=new GLTFLoader(); this.cache=new Map(); this.missing=new Set(); }
  async load(url){
    if(this.cache.has(url)) return this.clone(this.cache.get(url));
    try{
      const gltf=await this.loader.loadAsync(url);
      const root=gltf.scene;
      root.traverse(o=>{
        if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(o.material?.map)o.material.map.colorSpace=THREE.SRGBColorSpace;}
      });
      this.cache.set(url,root);
      return this.clone(root);
    }catch(e){
      this.missing.add(url);
      return null;
    }
  }
  clone(root){
    const copy=root.clone(true);
    copy.traverse(o=>{if(o.isMesh){o.material=o.material?.clone?.()||o.material;}});
    return copy;
  }
  async loadBest(spec){
    if(!spec) return null;
    const candidates=[spec.high,spec.medium,spec.low].filter(Boolean);
    for(const url of candidates){
      const model=await this.load("assets/"+url);
      if(model) return model;
    }
    const missingPath=spec.high ? "assets/"+spec.high : candidates.map(x=>"assets/"+x).join(", ");
    this.missing.add(missingPath);
    console.warn(`[ASSET MISSING] ${missingPath}`);
    return null;
  }
  async loadList(list){return Promise.all(list.map(x=>this.loadBest(x)));}
}

export function enableModelLOD(group, levels){
  if(!levels?.length)return group;
  const lod=new THREE.LOD();
  for(const l of levels) if(l.object) lod.addLevel(l.object,l.distance);
  return lod;
}

export function findWheels(root){
  const names=["wheel_fl","wheel_fr","wheel_rl","wheel_rr","front_left","front_right","rear_left","rear_right"];
  const out=[];root.traverse(o=>{const n=o.name.toLowerCase();if(names.some(x=>n.includes(x)))out.push(o);});
  if(out.length>=4)return out.slice(0,4);
  root.traverse(o=>{if(out.length<4 && o.isMesh && /wheel|tire|tyre|rim/i.test(o.name))out.push(o);});
  return out.slice(0,4);
}

export function setModelScaleToHeight(root,targetHeight){
  const box=new THREE.Box3().setFromObject(root), size=box.getSize(new THREE.Vector3());
  if(size.y>0){const s=targetHeight/size.y;root.scale.multiplyScalar(s);}
  root.updateMatrixWorld(true);return root;
}
