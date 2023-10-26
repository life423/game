const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;
let highScore = 0;

let x = canvas.width / 2;
let y = 488;
const width = 30;
const height = 30;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

let up = true;
let down = true;
let right = true;
let left = true;

const NUM_LANES = 5;
const LANE_HEIGHT = canvas.height / NUM_LANES;

const squareWidth = 20;
const squareHeight = 20;


const keyDownHandler = (e) => {
  const { keyCode } = e;
  switch (keyCode) {
    case 39:
      rightPressed = true;
      break;
    case 37:
      leftPressed = true;
      break;
    case 38:
      upPressed = true;
      break;
    case 40:
      downPressed = true;
      break;
  }
};

const keyUpHandler = (e) => {
  const { keyCode } = e;
  switch (keyCode) {
    case 39:
      rightPressed = false;
      break;
    case 37:
      leftPressed = false;
      break;
    case 38:
      upPressed = false;
      break;
    case 40:
      downPressed = false;
      break;
  }
};

function moveFrong() {
  if (upPressed === true && up === true && y > 20) {
    y = y - 40;
    up = false;
  }
  if (upPressed === false) {
    up = true;
  }
  if (
    downPressed === true &&
    down === true &&
    y + height <= canvas.height - 10
  ) {
    y = y + 40;
    down = false;
  }
  if (downPressed === false) {
    down = true;
  }
  if (rightPressed === true && right === true && x < 520) {
    x = x + 40;
    right = false;
  }
  if (rightPressed === false) {
    right = true;
  }
  if (leftPressed === true && left === true && x > 20) {
    x = x - 40;
    left = false;
  }
  if (leftPressed === false) {
    left = true;
  }
}

function drawSqaure() {
  ctx.beginPath();
  ctx.rect(x, y, 20, 20);
  ctx.fillStyle = "white";
  ctx.fill();
}

/**
 * Represents a car in the game.
 * @constructor
 * @param {number} width - The width of the car.
 * @param {number} lane - The lane in which the car is located.
 */
class Car {
  constructor(width, lane) {
    this.x = x;
    this.y = lane * LANE_HEIGHT;
    this.width = width;
    this.speed = Math.random() * 2 + 2;
  }

  /**
   * Draws the car on the canvas.
   */
  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, 25);
    ctx.fillStyle = "#1FF2F2";
    ctx.fill();
  }

  /**
   * Updates the position of the car on the canvas.
   */
  update() {
    this.x += this.speed;
    if (this.x > canvas.width) {
      this.x = -this.width;
    }
    this.draw();
  }
}

const cars = [
  new Car(
    randomIntFromInterval(40, 100),
    Math.floor(Math.random() * NUM_LANES)
  ),
];

function detectCollision() {
  cars.forEach(function (car) {
    const playerLeft = x;
    const playerRight = x + width;
    const playerTop = y;
    const playerBottom = y + height;

    const carLeft = car.x;
    const carRight = car.x + car.z;
    const carTop = car.y;
    const carBottom = car.y + 25;

    const collisionX = carLeft < playerRight && carRight > playerLeft;
    const collisionY = carTop < playerBottom && carBottom > playerTop;

    if (collisionX && collisionY) {
      score = 0;
      cars.length = 1;
      document.getElementById("score").innerHTML = score;
      y = 488;
    }
  });
}

function checkForWinner() {
  if (y < 10) {
    score++;
    addCar();

    document.getElementById("score").innerHTML = score;

    y = 488;
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function displaySquares() {
  cars.forEach(function (car) {
    car.update();
  });
}

function addCar() {
  const occupiedLanes = new Set(cars.map((car) => car.lane));
  let availableLanes = [...Array(NUM_LANES).keys()].filter(
    (lane) => !occupiedLanes.has(lane)
  );

  if (availableLanes.length === 0) {
    // All lanes are occupied, can't add a new car
    return;
  }

  const lane =
    availableLanes[Math.floor(Math.random() * availableLanes.length)];

  if (score <= 2) {
    cars.push(new Car(randomIntFromInterval(40, 100), lane));
  }

  if (score % 4 === 0) {
    cars.push(new Car(randomIntFromInterval(40, 100), lane));
  }
}

function getHighScore() {
  if (score > highScore) {
    highScore = score;
    document.getElementById("highScore").innerHTML = highScore;
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSqaure();
  displaySquares();
  moveFrong();
  detectCollision();
  getHighScore();
  checkForWinner();
}

const startGame = () => {
  // Add code to start the game
}
animate();

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);



document.getElementById("startButton").addEventListener("click", startGame);

