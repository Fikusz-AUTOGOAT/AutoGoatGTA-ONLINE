// game.js — logika gry Euro Truck (demo)
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Dane pojazdu
let truck = {
  x: canvas.width / 2,
  y: canvas.height - 150,
  speed: 0,
  gear: "N",
  angle: 0,
  img: new Image()
};

truck.img.src = "truck_body.png";  // zmienione ścieżki

// Tło
const road = new Image();
road.src = "road_tile.png";

const grass = new Image();
grass.src = "grass_tile.png";

const sky = new Image();
sky.src = "skybox.jpg";

// Sterowanie
let keys = {};

// HUD
const speedEl = document.getElementById("speed");
const gearEl = document.getElementById("gear");

document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

document.getElementById("resetBtn").addEventListener("click", () => {
  truck.x = canvas.width / 2;
  truck.y = canvas.height - 150;
  truck.speed = 0;
  truck.angle = 0;
  truck.gear = "N";
});

function update() {
  if (keys["w"] || keys["arrowup"]) {
    truck.speed += 0.1;
    truck.gear = "D";
  }

  if (keys["s"] || keys["arrowdown"]) {
    truck.speed -= 0.1;
    truck.gear = truck.speed < 0 ? "R" : "D";
  }

  if (keys["a"] || keys["arrowleft"]) {
    truck.angle -= 2;
  }
  if (keys["d"] || keys["arrowright"]) {
    truck.angle += 2;
  }

  truck.speed *= 0.98;
  if (truck.speed > 10) truck.speed = 10;
  if (truck.speed < -5) truck.speed = -5;

  truck.x += Math.sin(truck.angle * Math.PI / 180) * truck.speed;
  truck.y -= Math.cos(truck.angle * Math.PI / 180) * truck.speed;

  speedEl.textContent = Math.abs(truck.speed * 10).toFixed(0);
  gearEl.textContent = truck.gear;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sky
  ctx.drawImage(sky, 0, 0, canvas.width, canvas.height / 2);

  // Grass
  for (let gx = 0; gx < canvas.width; gx += 256) {
    for (let gy = canvas.height / 2; gy < canvas.height; gy += 256) {
      ctx.drawImage(grass, gx, gy, 256, 256);
    }
  }

  // Road
  for (let ry = 0; ry < canvas.height; ry += 128) {
    ctx.drawImage(road, canvas.width / 2 - 128, ry, 256, 128);
  }

  // Truck
  ctx.save();
  ctx.translate(truck.x, truck.y);
  ctx.rotate(truck.angle * Math.PI / 180);
  ctx.drawImage(truck.img, -64, -64, 128, 128);
  ctx.restore();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const miniMap = document.getElementById("miniMap");
const mctx = miniMap.getContext("2d");

// Dane gracza
let player = {
  x: 1000,
  y: 1000,
  speed: 0,
  gear: "N",
  angle: 0,
  money: 0,
  hasTrailer: false,
  truckImg: new Image(),
  trailerImg: new Image()
};

player.truckImg.src = "truck_body.png";
player.trailerImg.src = "trailer.png";

// Świat gry
const world = {
  width: 5000,
  height: 5000,
  cities: [
    { name: "Warszawa", x: 1000, y: 1000 },
    { name: "Berlin", x: 3500, y: 1200 },
    { name: "Praga", x: 2200, y: 3000 },
    { name: "Gdańsk", x: 1200, y: 4000 }
  ],
  roads: [
    [1000,1000, 3500,1200],
    [1000,1000, 2200,3000],
    [2200,3000, 3500,1200],
    [1000,1000, 1200,4000]
  ]
};

// Sterowanie
let keys = {};
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

document.getElementById("resetBtn").addEventListener("click", () => {
  player.x = 1000;
  player.y = 1000;
  player.speed = 0;
  player.angle = 0;
});

// HUD
const speedEl = document.getElementById("speed");
const gearEl = document.getElementById("gear");
const moneyEl = document.getElementById("money");

function update() {
  if (keys["w"] || keys["arrowup"]) {
    player.speed += 0.15;
    player.gear = "D";
  }
  if (keys["s"] || keys["arrowdown"]) {
    player.speed -= 0.15;
    player.gear = player.speed < 0 ? "R" : "D";
  }
  if (keys["a"] || keys["arrowleft"]) {
    player.angle -= 2;
  }
  if (keys["d"] || keys["arrowright"]) {
    player.angle += 2;
  }

  player.speed *= 0.98;
  if (player.speed > 10) player.speed = 10;
  if (player.speed < -5) player.speed = -5;

  player.x += Math.sin(player.angle * Math.PI / 180) * player.speed;
  player.y -= Math.cos(player.angle * Math.PI / 180) * player.speed;

  // Podłączanie naczepy
  if (keys[" "]) {
    let city = world.cities.find(c => dist(player.x, player.y, c.x, c.y) < 100);
    if (city) {
      player.hasTrailer = !player.hasTrailer;
      if (!player.hasTrailer) {
        player.money += 500; // kurs zakończony
      }
    }
  }

  speedEl.textContent = Math.abs(player.speed * 10).toFixed(0);
  gearEl.textContent = player.gear;
  moneyEl.textContent = player.money;
}

function draw() {
  ctx.fillStyle = "green";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // Drogi
  ctx.strokeStyle = "gray";
  ctx.lineWidth = 40;
  world.roads.forEach(r => {
    ctx.beginPath();
    ctx.moveTo(r[0] - player.x + canvas.width/2, r[1] - player.y + canvas.height/2);
    ctx.lineTo(r[2] - player.x + canvas.width/2, r[3] - player.y + canvas.height/2);
    ctx.stroke();
  });

  // Miasta
  world.cities.forEach(city => {
    let cx = city.x - player.x + canvas.width/2;
    let cy = city.y - player.y + canvas.height/2;
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(cx, cy, 50, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.fillText(city.name, cx-20, cy-60);
  });

  // Ciężarówka
  ctx.save();
  ctx.translate(canvas.width/2, canvas.height/2);
  ctx.rotate(player.angle * Math.PI / 180);
  ctx.drawImage(player.truckImg, -64, -64, 128, 128);
  if (player.hasTrailer) {
    ctx.drawImage(player.trailerImg, -64, 70, 128, 128);
  }
  ctx.restore();

  drawMiniMap();
}

function drawMiniMap() {
  mctx.fillStyle = "#222";
  mctx.fillRect(0,0,miniMap.width,miniMap.height);

  mctx.strokeStyle = "white";
  world.roads.forEach(r=>{
    mctx.beginPath();
    mctx.moveTo(r[0]/30, r[1]/30);
    mctx.lineTo(r[2]/30, r[3]/30);
    mctx.stroke();
  });

  world.cities.forEach(city=>{
    mctx.fillStyle="yellow";
    mctx.fillRect(city.x/30-2, city.y/30-2, 4,4);
  });

  mctx.fillStyle="red";
  mctx.fillRect(player.x/30-2, player.y/30-2, 4,4);
}

function dist(x1,y1,x2,y2){
  return Math.sqrt((x1-x2)**2+(y1-y2)**2);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

