//TODO: Ability to input custom palette(s) (currently, I prefer generating a random rgb value for convenience)

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

// Get random # from 0 to x
function getRandom(x) {
  return Math.floor(Math.random() * x);
}

// Get random # from x to y
function getRandomRange(x, y) {
  return Math.floor(Math.random() * y) + x;
}

// Non-integer random # b/w x and y
function getRandomRangeNI(x, y) {
  return Math.random() * y + x;
}

const twoPI = Math.PI * 2;

// Generate a random hex color
function random_hex_color() {
  let n = Math.floor(Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
}

// Generate random RGBA with ability to pass in alpha value
function random_rgb_color(a) {
  let r = getRandom(255);
  let g = getRandom(255);
  let b = getRandom(255);
  return `rgb(${r}, ${g}, ${b}, ${a})`;
}

//? ----------------------------------------- INST. CIRCLE VARIABLES -----------------------------------------

// Circle Variables
// X Y Coords
let x = getRandom(window.innerWidth);
let y = getRandom(window.innerHeight);

// Velocities
let x_velocity = getRandomRangeNI(1, 10);
let y_velocity = getRandomRangeNI(1, 10);

// Radius
let radius = 30;

// Color
let color = {
  r: 255,
  g: 0,
  b: 0,
  a: 0,
};

const max_radius = 50;
let min_radius = 2;

//? ----------------------------------------- EVENT LISTENERS -----------------------------------------

//! Note: will not work as an OBS overlay
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
  // console.log(`x: ${mouse.x}\ny:${mouse.y}`);
});

//! Note: functionality for mobile Safari users (same as mousemove)
// Event listener for click (for Safari mobile users)
// window.addEventListener("touchstart", function (e) {
//   // e.clientX -> mouse position X
//   mouse.x = e.clientX;
//   // e.clientY -> mouse position Y
//   mouse.y = e.clientY;
//   e.stopPropagation();
//   e.preventDefault();
// });

// window.addEventListener("touchend", function (e) {
//   // e.clientX -> mouse position X
//   mouse.x = e.clientX;
//   // e.clientY -> mouse position Y
//   mouse.y = e.clientY;
//   // mobile fixes
//   e.stopPropagation();
//   e.preventDefault();
// });

// window.addEventListener("click", function (e) {
//   // e.clientX -> mouse position X
//   mouse.x = e.clientX;
//   // e.clientY -> mouse position Y
//   mouse.y = e.clientY;
//   // mobile fixes
//   e.stopPropagation();
//   e.preventDefault();
// });

// Implementation for ios Safari
window.addEventListener("touchstart", function (e) {
  console.log(e);
  // e.clientX -> mouse position X
  mouse.x = e.touches[0].clientX;
  // e.clientY -> mouse position Y
  mouse.y = e.touches[0].clientY;
});

window.addEventListener("mouseover", function (e) {
  // e.clientX -> mouse position X
  mouse.x = e.clientX;
  // e.clientY -> mouse position Y
  mouse.y = e.clientY;
});

window.addEventListener("onclick", function (e) {
  // Does nothing
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
  this.radius = getRandom(10);
  this.min_radius = this.radius;

  // Determine x y coords w/ radius (prevents getting stuck on edges)
  this.x = getRandom(window.innerWidth - radius * 2);
  this.y = getRandom(window.innerHeight - radius * 2);

  this.x_velocity = getRandomRange(1, 3);
  this.y_velocity = getRandomRange(1, 3);

  // Set color
  //! Note: increased lightness & alpha for overlay suitability
  this.color = {
    r: getRandomRange(150, 255),
    g: getRandomRange(150, 255),
    b: getRandomRange(150, 255),
    a: 0.5,
  };

  // Set color to strokeStyle / fillStyle
  this.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
  // this.strokeStyle = `rgb(255, 255, 255, .1)`;

  // 1st, draw circle
  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, twoPI, false);
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
      this.x + this.radius > window.innerWidth ||
      this.x + this.radius <= this.radius
    ) {
      this.x_velocity = -this.x_velocity;
    }
    if (
      this.y + this.radius > window.innerHeight ||
      this.y + this.radius <= this.radius
    ) {
      this.y_velocity = -this.y_velocity;
    }

    // 3rd, Increment velocities
    this.x += this.x_velocity;
    this.y += this.y_velocity;

    // Interactivity with event listener
    //! Note: this functionality will not work with overlay
    // Determine distance from mouse x to indiv. circle's x coord
    if (
      mouse.x - this.x < max_radius &&
      mouse.x - this.x > -max_radius &&
      mouse.y - this.y < max_radius &&
      mouse.y - this.y > -max_radius &&
      this.radius < max_radius
    ) {
      // grow radius of circle (grows faster than shrinks)
      this.radius += 3;
      this.color.a += 0.1;
      this.draw();
    } else if (this.radius > this.min_radius) {
      this.radius -= 1;
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
