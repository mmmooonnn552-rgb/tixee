import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
export class CameraRig{
  constructor(camera,car){this.camera=camera;this.car=car;this.mode=2;this.tmp=new THREE.Vector3();this.offset=new THREE.Vector3();}
  next(){this.mode=(this.mode+1)%5;return this.mode;}
  update(dt){
    const c=this.camera,p=this.car.position;
    if(this.mode===0){ // first person
      this.offset.set(-.28,1.18,-.50).applyQuaternion(this.car.quaternion);c.position.copy(p).add(this.offset);const look=new THREE.Vector3(0,1.05,-18).applyQuaternion(this.car.quaternion).add(p);c.lookAt(look);
    }else if(this.mode===1){ // driver
      this.offset.set(-.45,1.15,-.15).applyQuaternion(this.car.quaternion);c.position.copy(p).add(this.offset);const look=new THREE.Vector3(-.45,1.0,-16).applyQuaternion(this.car.quaternion).add(p);c.lookAt(look);
    }else if(this.mode===2){ // third person
      this.offset.set(0,3.0,7.0).applyQuaternion(this.car.quaternion);c.position.lerp(p.clone().add(this.offset),Math.min(1,dt*6));c.lookAt(p.clone().add(new THREE.Vector3(0,.8,0)));
    }else if(this.mode===3){ // close
      this.offset.set(2.4,1.5,4.2).applyQuaternion(this.car.quaternion);c.position.lerp(p.clone().add(this.offset),Math.min(1,dt*6));c.lookAt(p.clone().add(new THREE.Vector3(0,.8,0)));
    }else{ // cinematic
      this.offset.set(-5,4.5,8).applyQuaternion(this.car.quaternion);c.position.lerp(p.clone().add(this.offset),Math.min(1,dt*2.5));c.lookAt(p.clone().add(new THREE.Vector3(0,.8,0)));
    }
  }
  name(){return ["FIRST","DRIVER","THIRD","CLOSE","CINEMA"][this.mode]}
}
