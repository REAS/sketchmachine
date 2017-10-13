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

let thickness = 30;

//
let ui = document.querySelector('#ui');
let speedSlider = document.querySelector('#speed-slider');

const colors = document.querySelector('#colors');

let dpi = window.devicePixelRatio;


function setup() {
  canvas = createCanvas(512, 512 + 100);

  canvas.id('animation');

  ui.prepend(canvas.elt);
  canvas.background(204);

  startGUI();

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

  timeStep = parseInt(speedSlider.value);

  if (startDrawing) {
    frames[currentFrame].fill(255);
    frames[currentFrame].noStroke();
    frames[currentFrame].ellipse(mx, my, thickness, thickness);
  }

  image(backgroundFrame, 0, 0, 512, 512);
  image(frames[currentFrame], 0, 0, 512, 512);
  image(tempFrame, 0, 0, 512, 512);

  //timeline();
  timelineH();

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
  /*
  if (key === ' ') {
    colors.classList.add('active')
  } else {
    colors.classList.remove('active')
  }
  */
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

}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    startDrawing = true;
  }
}

function mouseReleased() {
  //if (startDrawing) {
  //  frames[currentFrame] =
  //}
  startDrawing = false;
}

function windowResized() {
  //resizeCanvas(windowWidth, windowHeight);
  resizeGUI();
}