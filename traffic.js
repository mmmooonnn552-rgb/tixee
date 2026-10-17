import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class TrafficSystem{
  constructor(scene,city,models){this.scene=scene;this.city=city;this.models=models;this.cars=[];this.clock=0;this.signalPhase=0;this.spawn();}
  spawn(){
    const lanes=[];const B=this.city.block,H=this.city.half;
    for(let i=-H;i<=H;i++){lanes.push({axis:"x",lane:i*B-4,dir:1});lanes.push({axis:"x",lane:i*B+4,dir:-1});lanes.push({axis:"z",lane:i*B+4,dir:1});lanes.push({axis:"z",lane:i*B-4,dir:-1});}
    for(let i=0;i<32;i++){const lane=lanes[i%lanes.length],model=this.models[i%this.models.length];if(!model)continue;const car=model.clone(true);car.userData={...lane,speed:7+(i%9)*1.2,routeOffset:(i*19)%this.city.block,waiting:0};
      if(lane.axis==="x")car.position.set(-this.city.block*(this.city.half+1)+(i*23)%500,lane.lane,.2),car.rotation.y=lane.dir>0?0:Math.PI;
      else car.position.set(lane.lane,.2,-this.city.block*(this.city.half+1)+(i*31)%500),car.rotation.y=lane.dir>0?Math.PI/2:-Math.PI/2;
      this.scene.add(car);this.cars.push(car);
    }
  }
  signalGreen(car){const coord=car.userData.axis==="x"?car.position.x:car.position.z;const B=this.city.block;const d=Math.abs(coord-Math.round(coord/B)*B);const red=((Math.floor(this.clock/6)+Math.round(coord/B))%2)===0;return !(d<7&&red);}
  update(dt,player){this.clock+=dt;for(const car of this.cars){const u=car.userData;let factor=1;if(!this.signalGreen(car))factor=.05;const dx=car.position.x-player.position.x,dz=car.position.z-player.position.z;if(Math.hypot(dx,dz)<7)factor=.18;
      const step=u.speed*factor*dt*u.dir;if(u.axis==="x")car.position.x+=step;else car.position.z+=step;
      for(const other of this.cars){if(other===car)continue;const ox=other.position.x-car.position.x,oz=other.position.z-car.position.z;if(Math.abs(ox)<4&&Math.abs(oz)<2.2&&Math.sign(ox||oz)===u.dir){if(u.axis==="x"&&Math.abs(oz)<1.8&&ox*u.dir>0&&ox*u.dir<7)factor=.05;if(u.axis==="z"&&Math.abs(ox)<1.8&&oz*u.dir>0&&oz*u.dir<7)factor=.05;}}
      if(u.axis==="x")car.rotation.y=u.dir>0?0:Math.PI;else car.rotation.y=u.dir>0?Math.PI/2:-Math.PI/2;
      const lim=this.city.block*(this.city.half+1)+10;if(u.axis==="x"&&Math.abs(car.position.x)>lim)car.position.x=-Math.sign(car.position.x)*lim;if(u.axis==="z"&&Math.abs(car.position.z)>lim)car.position.z=-Math.sign(car.position.z)*lim;
      for(const w of car.userData.wheels||[])w.rotation.x-=step/.34;
    }}
}
