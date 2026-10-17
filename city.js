import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export const CITY_LAYOUT={
  block:64, half:3, roadWidth:18,
  buildingTypes:["residential_a","residential_b","commercial_a","mixed_use","modern"]
};

function place(root,x,z,y=0,rot=0){root.position.set(x,y,z);root.rotation.y=rot;return root;}

export async function createCity(scene,loader,manifest){
  const city=new THREE.Group();city.name="CairoGLBCity";
  const missing=[];
  const roadSpec=manifest.roads.find(x=>x.id==="straight");
  const intersectionSpec=manifest.roads.find(x=>x.id==="intersection");
  const sidewalkSpec=manifest.roads.find(x=>x.id==="sidewalk");
  const [road,intersection,sidewalk]=await Promise.all([roadSpec,intersectionSpec,sidewalkSpec].map(s=>s?loader.loadBest(s):Promise.resolve(null)));
  if(!road&&roadSpec)missing.push("assets/"+roadSpec.high); if(!intersection&&intersectionSpec)missing.push("assets/"+intersectionSpec.high); if(!sidewalk&&sidewalkSpec)missing.push("assets/"+sidewalkSpec.high);

  const roadLen=CITY_LAYOUT.block;
  for(let i=-CITY_LAYOUT.half;i<CITY_LAYOUT.half;i++)for(let j=-CITY_LAYOUT.half;j<CITY_LAYOUT.half;j++){
    const x=i*roadLen,z=j*roadLen;
    if(road){const a=place(road.clone(true),x+roadLen/2,z,0,0);city.add(a);const b=place(road.clone(true),x,z+roadLen/2,0,Math.PI/2);city.add(b);}
    if(sidewalk){
      for(const s of [-1,1]){city.add(place(sidewalk.clone(true),x+roadLen/2,z+s*(CITY_LAYOUT.roadWidth/2+1.8),0,0));city.add(place(sidewalk.clone(true),x+s*(CITY_LAYOUT.roadWidth/2+1.8),z+roadLen/2,0,Math.PI/2));}
    }
  }
  if(intersection){for(let i=-CITY_LAYOUT.half;i<=CITY_LAYOUT.half;i++)for(let j=-CITY_LAYOUT.half;j<=CITY_LAYOUT.half;j++)city.add(place(intersection.clone(true),i*roadLen,j*roadLen));}

  const buildingSpecs=manifest.buildings;
  for(let bx=-CITY_LAYOUT.half;bx<=CITY_LAYOUT.half;bx++)for(let bz=-CITY_LAYOUT.half;bz<=CITY_LAYOUT.half;bz++){
    const cx=bx*roadLen,cz=bz*roadLen;
    for(let k=0;k<3;k++){
      const spec=buildingSpecs[(Math.abs(bx*7+bz*3+k))%buildingSpecs.length];const model=await loader.loadBest(spec);
      if(!model){missing.push(spec.high);continue;}
      const x=cx+(k-1)*18,z=cz+((k%2)*2-1)*16;place(model,x,z,0,((k+bx+bz)*0.23)%1);city.add(model);
    }
  }
  const treeSpec=manifest.environment.find(x=>x.id==="tree");const tree=treeSpec?await loader.loadBest(treeSpec):null;if(!tree&&treeSpec)missing.push(treeSpec.high);
  if(tree){for(let i=-CITY_LAYOUT.half;i<=CITY_LAYOUT.half;i++)for(let j=-CITY_LAYOUT.half;j<=CITY_LAYOUT.half;j++){for(let k=0;k<4;k++){const t=tree.clone(true);place(t,i*roadLen+(k<2?-1:1)*(8+(k%2)*5),j*roadLen+(k%2?-1:1)*11);t.scale.multiplyScalar(.85+(k%3)*.1);city.add(t);}}}
  const propIds=["traffic_light","street_light","trash_bin","billboard","barrier","shopfront"];
  for(const id of propIds){const spec=manifest.props.find(x=>x.id===id);if(!spec)continue;const p=await loader.loadBest(spec);if(!p){missing.push(spec.high);continue;} for(let i=-CITY_LAYOUT.half;i<=CITY_LAYOUT.half;i+=2){const q=p.clone(true);place(q,i*roadLen+CITY_LAYOUT.roadWidth*.68,8,0,(id==="traffic_light"?Math.PI/2:0));city.add(q);}}
  scene.add(city);return {group:city,missing:[...new Set(missing)]};
}
