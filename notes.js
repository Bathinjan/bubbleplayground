//! -------------------------------------------------- IMPORTANT NOTE --------------------------------------------------
//! -------------------------- Disregard this script: it is a placeholder for my Canvas notes --------------------------
//! --------------------------------------------------------------------------------------------------------------------

//? ----------------------------------------- GETTING STARTED -----------------------------------------

// Grab Canvas reference
const canvas = document.querySelector("canvas");

// Debug
// console.log(canvas);

// Set initial canvas width / height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create context variable
var c = canvas.getContext("2d");

//? ----------------------------------------- SOME DEFAULT FUNCTIONS -----------------------------------------

function getRandom(x) {
  return Math.floor(Math.random() * x);
}

function getRandomRange(x, y) {
  return Math.floor(Math.random() * y) + x;
}

// Non-integer random #
function getRandomRangeNI(x, y) {
  return Math.random() * y + x;
}

const twoPI = Math.PI * 2;

function random_hex_color() {
  let n = Math.floor(Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
}

// random RGBA with ability to pass in alpha value
function random_rgb_color(a) {
  let r = getRandom(255);
  let g = getRandom(255);
  let b = getRandom(255);
  return `rgb(${r}, ${g}, ${b}, ${a})`;
}

//? --------------------------------------- DRAWING TO CANVAS ---------------------------------------

//* ----------------- Rectangle --------------------
// fillReact method
// c.fillRect(x, y, width, height);
// c.fillRect(100, 100, 100, 100);

// Add color to box
// c.fillStyle = "#52489C";
// c.fillRect(100, 100, 100, 100);
// Any fill style before an instantiated rect will take that style

//* ----------------- Line --------------------

// Declare a Path
// c.beginPath();

// Draw starting point
// c.moveTo(x,y)
// c.moveTo(50, 300);

// Draw line to new point
// c.lineTo(300, 100);

// Add color to line (any css color)
// c.strokeStyle = "#9368B7";

//* ----------------- Stroke --------------------

// Call stroke method to show any instantiated objects
// c.stroke();

//* ----------------- Arc --------------------

// Creating a circle
// c.arc(x: Int, y: Int, r: Int, startingAngle: Float, endAngle: Float, drawCounterClockwise: Bool (false) );
// Start angle takes RADIANS, not degrees!!

// Remember to start with .beginPath() to start a separate object / shape
// c.beginPath();
// c.arc(300, 300, 30, 0, Math.PI * 2, false);
// c.strokeStyle = "#FFA630";

// call Stroke() to instantiate
// c.stroke();

//* Instantiate 100 random circles

// for (let i = 0; i < 100; i++) {
//   let x = Math.floor(Math.random() * window.innerWidth);
//   let y = Math.floor(Math.random() * window.innerHeight);

//   c.beginPath();
//   c.arc(x, y, 30, 0, Math.PI * 2, false);

//   let m = random_hex_color();
//   c.strokeStyle = `${m}`;
//   c.stroke();
// }

//? ----------------------------------------- INST. CIRCLE VARIABLES -----------------------------------------

// Circle Variables
// X Y Coords
let x = getRandom(window.innerWidth);
let y = getRandom(window.innerHeight);

let x_velocity = getRandomRangeNI(1, 10);
let y_velocity = getRandomRangeNI(1, 10);

let circle_radius = 30;

let color = {
  r: 255,
  g: 0,
  b: 0,
  a: 0,
};

const max_radius = 50;
let min_radius = 2;

//? ----------------------------------------- PRACTICE -----------------------------------------

// Creating an animation loop
// function animate() {
//   requestAnimationFrame(animate);
//   // Clear the frame (prevents re-drawing of circles)
//   c.clearRect(0, 0, window.innerWidth, window.innerHeight);

//   // Instantiate Circle
//   c.beginPath();
//   c.arc(x, y, 30, 0, twoPI, false);
//   c.strokeStyle = "pink";
//   c.stroke();

//   // Increment velocity
//   x += x_velocity;
//   y += y_velocity;

//   // X / Y velocity change when hitting a wall;
//   // When X or Y hit the edge of the screen, velocity should become negative (will move in opposing direction)
//   if (x + circle_radius > window.innerWidth || x + circle_radius <= circle_radius) {
//     // become negative
//     x_velocity = -x_velocity;
//   }

//   if (y + circle_radius > innerHeight || y + circle_radius <= circle_radius) {
//     y_velocity = -y_velocity;
//   }
// }

// animate();
//? ----------------------------------------- EVENT LISTENERS -----------------------------------------

//* --------------------------------- MOUSE MOVEMENT ---------------------------------
// Store mouse event details in object
let mouse = {
  x: undefined,
  y: undefined,
};

// Event listener for mouse movement across screen
window.addEventListener("mousemove", function (e) {
  // e.clientX -> mouse position X
  mouse.x = e.clientX;
  // e.clientY -> mouse position Y
  mouse.y = e.clientY;

  // Debug
  console.log(`x: ${mouse.x}\ny:${mouse.y}`);
});

//* --------------------------------- RESIZING WINDOW ---------------------------------

// Called whenever window is resized
window.addEventListener("resize", function (e) {
  // Re-set canvas w x h
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initializeArray();
});

//? ----------------------------------------- ANIMATION -----------------------------------------
// Automating animation process using OOP
function Circle() {
  // Instantiation
  // Radius first (basis for other calculations)
  this.circle_radius = getRandom(10);
  this.min_radius = this.circle_radius;

  // Determine x y coords w/ radius (prevents getting stuck on edges)
  this.x = getRandom(window.innerWidth - circle_radius * 2);
  this.y = getRandom(window.innerHeight - circle_radius * 2);

  this.x_velocity = getRandomRange(1, 3);
  this.y_velocity = getRandomRange(1, 3);

  // Set color
  this.color = {
    r: getRandom(255),
    g: getRandom(255),
    b: getRandom(255),
    a: 0.3,
  };

  // Set color to strokeStyle / fillStyle
  this.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
  // this.strokeStyle = `rgb(255, 255, 255, .1)`;

  // 1st, draw circle
  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.circle_radius, 0, twoPI, false);
    c.fillStyle = this.fillStyle;
    c.fill();
    // c.strokeStyle = this.strokeStyle;
    // c.stroke();
    c.closePath();
  };

  // 2nd, change properties in an update function
  this.update = function () {
    // Conditionals for hitting edge of screen
    if (
      this.x + this.circle_radius > window.innerWidth ||
      this.x + this.circle_radius <= this.circle_radius
    ) {
      this.x_velocity = -this.x_velocity;
    }
    if (
      this.y + this.circle_radius > window.innerHeight ||
      this.y + this.circle_radius <= this.circle_radius
    ) {
      this.y_velocity = -this.y_velocity;
    }

    // 3rd, Increment velocities
    this.x += this.x_velocity;
    this.y += this.y_velocity;

    // Interactivity with event listener
    // Determine distance from mouse x to indiv. circle's x coord
    if (
      mouse.x - this.x < max_radius &&
      mouse.x - this.x > -max_radius &&
      mouse.y - this.y < max_radius &&
      mouse.y - this.y > -max_radius &&
      this.circle_radius < max_radius
    ) {
      // grow radius of circle (grows faster than shrinks)
      this.circle_radius += 3;
      this.color.a += 0.1;
      this.draw();
    } else if (this.circle_radius > this.min_radius) {
      this.circle_radius -= 1;
      this.color.a -= 0.1;
      this.draw();
    }

    // Finally, draw
    this.draw();
  };
}

// Store circles in array
let circleArray = [];

// Initialize Array
function initializeArray() {
  // Reset array (in case it's already populated)
  circleArray = [];

  // Push a new circle to each pos in array
  for (let i = 0; i < 500; i++) {
    circleArray.push(new Circle());
  }
}

function animate() {
  // Recursively call animate every frame
  requestAnimationFrame(animate);

  // Clear context / canvas for next redraw
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // Update each iteration through circleArray
  for (const circ of circleArray) {
    circ.update();
  }
}

// initialize the array
initializeArray();

// Finally, call animate
animate(c);
