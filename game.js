// Prosta gra wyścigowa z three.js
// ogranicz prędkość
speed = Math.max(Math.min(speed, maxSpeed), -0.6);


// skręcanie (im szybszy tym większy wpływ)
const steerPower = 1.5 * (0.2 + Math.abs(speed));
if(left) player.rotation.y += 0.02 * steerPower * dt*60;
if(right) player.rotation.y -= 0.02 * steerPower * dt*60;


// ruch naprzód w kierunku z przodu pojazdu
const forwardVec = new THREE.Vector3(0,0,1);
forwardVec.applyQuaternion(player.quaternion);
forwardVec.normalize();
player.position.add(forwardVec.multiplyScalar(speed * dt * 60));


// proste ograniczenie granic toru
const limit = 92;
if(player.position.x > limit) player.position.x = limit;
if(player.position.x < -limit) player.position.x = -limit;
if(player.position.z > limit) player.position.z = limit;
if(player.position.z < -limit) player.position.z = -limit;


// Kamera podąża i lekko "lerp"
const camTargetPos = new THREE.Vector3().copy(player.position).add(new THREE.Vector3(0,6,-12).applyQuaternion(player.quaternion));
camera.position.lerp(camTargetPos, 0.12);
const lookAtPos = new THREE.Vector3().copy(player.position).add(new THREE.Vector3(0,1.5,3).applyQuaternion(player.quaternion));
camera.lookAt(lookAtPos);


// HUD
if(hudSpeed) hudSpeed.innerText = 'Prędkość: ' + Math.round(speed * 120);
if(hudLap) hudLap.innerText = 'Ok. ' + lap;
}


function updateAI(dt){
scene.traverse(obj=>{
if(obj.userData && obj.userData.radius){
obj.userData.angle += obj.userData.speed * dt;
const a = obj.userData.angle;
obj.position.set(Math.cos(a)*obj.userData.radius,0.5,Math.sin(a)*obj.userData.radius);
// ustaw orientację
obj.lookAt(0,0,0);
}
});
}


function checkLaps(){
// prosty checkpoint: przejście przez linię z = -80 w obszarze x between -10..10
if(player.position.z < -78 && Math.abs(player.position.x) < 10){
// aby nie naliczać co klatkę, wykorzystamy timer
if(!player.userData || !player.userData.lastCross || (Date.now() - player.userData.lastCross) > 2000){
player.userData = player.userData || {};
player.userData.lastCross = Date.now();
lap += 1;
}
}
}


function animate(){
requestAnimationFrame(animate);
const dt = clock.getDelta();
updatePlayer(dt);
updateAI(dt);
checkLaps();
renderer.render(scene, camera);
