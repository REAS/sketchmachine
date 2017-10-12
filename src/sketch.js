// python -m SimpleHTTPServer 8000

let canvas;

let frames = [];
let backgroundFrame;
let tempFrame;

let numFrames = 48;
let firstFrame = 0;
let lastFrame = 12;
let cf = 0;

let frameDim = 512;

let px = 20;
let py = 20;

let lastTime = 0;
let timeStep = 500; //40;  // In milliseconds

let pause = false;
let startDrawing = false;

let thickness = 30;

//
let ui = document.querySelector('#ui');
let speedSlider = document.querySelector('#speed-slider');

const colors = document.querySelector('#colors');


function setup() {
  canvas = createCanvas(512, 512 + 50);
  
  //canvas.position(px, py);
  canvas.id('animation');

  ui.prepend(canvas.elt);
  canvas.background(204);

  startGUI();

  for (let i = 0; i < numFrames; i++) {
    frames[i] = createGraphics(frameDim, frameDim);
    //frames[i].background(0, 0, 255);
  }

  backgroundFrame = createGraphics(frameDim, frameDim);
  backgroundFrame.background(0, 0, 102);

  tempFrame = createGraphics(frameDim, frameDim);

  lastTime = millis();
}

function draw() {

  if (startDrawing) {
    mx = mouseX;
    my = mouseY;
  }

  background(204);
  fill(255);
  noStroke();
  rect(0);

  timeStep = parseInt(speedSlider.value);

  if (startDrawing) {
    frames[cf].fill(255);
    frames[cf].noStroke();
    frames[cf].ellipse(mx, my, thickness, thickness);
  }

  image(backgroundFrame, 0, 0);
  image(frames[cf], 0, 0);
  image(tempFrame, 0, 0);

  //timeline();
  timelineH();

  if (!pause) {
    if (millis() > lastTime + timeStep) {
      cf++;
      if (cf >= lastFrame) {
        cf = firstFrame;
      }
      lastTime = millis();
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    colors.classList.add('active')
  } else {
    colors.classList.remove('active')
  }
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    startDrawing = true;
  }
}

function mouseReleased() {
  startDrawing = false;
}

function windowResized() {
  //resizeCanvas(windowWidth, windowHeight);
  resizeGUI();
}