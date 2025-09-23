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
