// Podstawowa gra wyścigowa w Three.js
// Wymaga lokalnego pliku three.min.js

let scene, camera, renderer;
let player, track;
let speed = 0;
let maxSpeed = 1.8;
let acceleration = 0.02;
let friction = 0.01;
let lap = 0;
let clock;

const hudSpeed = document.getElementById('speed');
const hudLap = document.getElementById('lap');

init();
animate();

function init(){
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x101820, 0.0025);

  // Kamera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 6, -12);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0b1220);
  document.getElementById('gameContainer').appendChild(renderer.domElement);

  // Światło
  const amb = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(amb);
  const dir = new THREE.DirectionalLight(0xffffff, 0.6);
  dir.position.set(10,20,10);
  scene.add(dir);

  // Tor
  const trackGeo = new THREE.PlaneGeometry(200, 200, 10, 10);
  const trackMat = new THREE.MeshStandardMaterial({ color:0x2a2a2a });
  track = new THREE.Mesh(trackGeo, trackMat);
  track.rotation.x = -Math.PI/2;
  scene.add(track);

  // Linie toru
  const lineMat = new THREE.LineBasicMaterial({ color:0x666666 });
  const points = [
    new THREE.Vector3(-80,0.01,-80),
    new THREE.Vector3(80,0.01,-80),
    new THREE.Vector3(80,0.01,80),
    new THREE.Vector3(-80,0.01,80),
    new THREE.Vector3(-80,0.01,-80),
  ];
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
  scene.add(new THREE.Line(lineGeo, lineMat));

  // Auto gracza
  const carGeo = new THREE.BoxGeometry(1.6,0.7,3);
  const carMat = new THREE.MeshStandardMaterial({ color:0xff3333 });
  player = new THREE.Mesh(carGeo, carMat);
  player.position.set(0,0.5,0);
  player.rotationOrder = 'YXZ';
  scene.add(player);

  camera.lookAt(player.position);

  // Eventy
  window.addEventListener('resize', onWindowResize);
  setupControls();
}

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const keys = {};
function setupControls(){
  window.addEventListener('keydown', e=>{ keys[e.code] = true; });
  window.addEventListener('keyup', e=>{ keys[e.code] = false; });
}

function updatePlayer(dt){
  const forward = keys['ArrowUp'] || keys['KeyW'];
  const backward = keys['ArrowDown'] || keys['KeyS'];
  const left = keys['ArrowLeft'] || keys['KeyA'];
  const right = keys['ArrowRight'] || keys['KeyD'];

  if(forward) speed += acceleration;
  if(backward) speed -= acceleration*0.8;
  if(!forward && Math.abs(speed) > 0) speed -= Math.sign(speed) * friction * 0.8;
  speed = Math.max(Math.min(speed, maxSpeed), -0.6);

  const steerPower = 1.5 * (0.2 + Math.abs(speed));
  if(left) player.rotation.y += 0.02 * steerPower * dt*60;
  if(right) player.rotation.y -= 0.02 * steerPower * dt*60;

  const forwardVec = new THREE.Vector3(0,0,1);
  forwardVec.applyQuaternion(player.quaternion).normalize();
  player.position.add(forwardVec.multiplyScalar(speed * dt * 60));

  const limit = 92;
  player.position.x = Math.max(Math.min(player.position.x, limit), -limit);
  player.position.z = Math.max(Math.min(player.position.z, limit), -limit);

  const camTargetPos = new THREE.Vector3().copy(player.position).add(new THREE.Vector3(0,6,-12).applyQuaternion(player.quaternion));
  camera.position.lerp(camTargetPos, 0.12);
  const lookAtPos = new THREE.Vector3().copy(player.position).add(new THREE.Vector3(0,1.5,3).applyQuaternion(player.quaternion));
  camera.lookAt(lookAtPos);

  hudSpeed.innerText = 'Prędkość: ' + Math.round(speed * 120);
  hudLap.innerText = 'Okrążenie: ' + lap;
}

function animate(){
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  updatePlayer(dt);
  renderer.render(scene, camera);
}
