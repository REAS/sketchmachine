// python -m SimpleHTTPServer 8000

let canvas;

let frames = [];
let backgroundFrame;
let tempFrame;

let numFrames = 48;
let firstFrame = 0;
let lastFrame = 12;
let currentFrame = 0;

let frameDim = 512;

let lastTime = 0;
let timeStep = 500; //40;  // In milliseconds

let pause = false;
let startDrawing = false;

let mobile = false;  // Global variable, if on phone or not

let mx, my, pmx, pmy = 0;

//
let ui = document.querySelector('#ui');
let timeline = document.querySelector('#timeline');
let speedSlider = document.querySelector('#speed-slider');

const colors = document.querySelector('#colors');

let dpi = window.devicePixelRatio;

// TIMELINE

let overFrame = new Array(numFrames).fill(false);
let overMaker = new Array(numFrames).fill(false);
let onFrame = new Array(numFrames).fill(false);
let firstClick = false;
let addMode = true;  // Add or remove active frames

// "BRUSHES"
let b1Select = document.querySelector("#b1-select");
let b1Tools = document.querySelector("#b1-tools");
let b1Slider = document.querySelector('#b1-slider');
let b1Color = document.querySelector('#b1-color');
let b1Thickness = 1;


function setup() {
  canvas = createCanvas(frameDim, frameDim + 80);

  canvas.id('animation');

  //ui.prepend(canvas.elt);
  timeline.prepend(canvas.elt);
  canvas.background(204);

  for (let i = 0; i < numFrames; i++) {
    frames[i] = createGraphics(frameDim * dpi, frameDim * dpi);
    //frames[i].background(0, 0, 255);
  }

  backgroundFrame = createGraphics(frameDim * dpi, frameDim * dpi);
  backgroundFrame.background(0, 0, 102);

  tempFrame = createGraphics(frameDim * dpi, frameDim * dpi);

  lastTime = millis();
}

function draw() {

  if (startDrawing) {
    //mx = mouseX / dpi;
    //my = mouseY / dpi;
    mx = mouseX;
    my = mouseY;
  }

  background(204);
  fill(255);
  noStroke();
  rect(0);

  // TIMELINE
  timeStep = parseInt(speedSlider.value);

  // "BRUSHES"
  let b1OnOff = b1Select.checked;

  //console.log(b1OnOff);

  // Draw the time line to set the boolean values for
  // frames on and off before frames are drawn into
  timeLineH();

  if (startDrawing) {
    for (let i = firstFrame; i < lastFrame; i++) {
      if (onFrame[i] || i === currentFrame) {
        if (b1OnOff) {
          mark1(i);
        }
      }
    }
  }

  image(backgroundFrame, 0, 0, 512, 512);
  image(frames[currentFrame], 0, 0, 512, 512);
  image(tempFrame, 0, 0, 512, 512);

  if (startDrawing) {
    pmx = mx;
    pmy = my;
  }

  if (!pause) {
    if (millis() > lastTime + timeStep) {
      currentFrame++;
      if (currentFrame >= lastFrame) {
        currentFrame = firstFrame;
      }
      lastTime = millis();
    }
  }
}

function keyPressed() {

  if (key === 'p' || key === 'P') {
    colors.classList.add('active')
  } else {
    colors.classList.remove('active')
  }

  if (key === ' ') {
    pause = !pause;
  }
  if (pause) {
    if (keyCode === RIGHT_ARROW) {
      currentFrame++;
      if (currentFrame >= lastFrame) {
        currentFrame = firstFrame;
      }
    }
    if (keyCode === LEFT_ARROW) {
      currentFrame--;
      if (currentFrame < firstFrame) {
        currentFrame = lastFrame-1;
      }
    }
  }
  if (key === 'c' ||  key === 'C') {
    onFrame.fill(false);
  }
  if (key === 'a' || key === 'A') {
    onFrame.fill(true);
  }

}

function mousePressed() {
  // If click in animation area
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < width) {
    startDrawing = true;
    pmx = mouseX;
    pmy = mouseY;
  }
}

function mouseReleased() {
  startDrawing = false;
  selectFirstFrame = false;
  selectLastFrame = false;
}

function windowResized() {
  //resizeCanvas(windowWidth, windowHeight);
  //resizeGUI();
}