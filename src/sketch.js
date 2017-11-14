// python -m SimpleHTTPServer 8000

let canvas;

let frames = [];
let backgroundFrame;
let markerFrames = [];

let numFrames = 48;
let numMarkerFrames = 5;
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
let rx, ry = 0;

//
let ui = document.querySelector('#ui');
let timeline = document.querySelector('#timeline');
let speedSlider = document.querySelector('#speed');

const colors = document.querySelector('#colors');

let dpi = window.devicePixelRatio;

// TIMELINE

let overFrame = new Array(numFrames).fill(false);
let overMarker = new Array(numFrames).fill(false);
let onFrame = new Array(numFrames).fill(false);
let firstClick = false;
let addMode = true;  // Add or remove active frames

// "MAKERS"
let marker1Select = document.querySelector("#b1-select");
let marker1Tools = document.querySelector("#b1-tools");
let marker1Slider = document.querySelector("#b1-slider");
let marker1Color = document.querySelector("#b1-color");

let marker2Select = document.querySelector("#b2-select");
let marker2Tools = document.querySelector("#b2-tools");
let marker2Slider = document.querySelector("#b2-slider");
let marker2Color = document.querySelector("#b2-color");

let marker3Select = document.querySelector("#b3-select");
let marker3Tools = document.querySelector("#b3-tools");
let marker3Slider = document.querySelector("#b3-slider");
let marker3Color = document.querySelector("#b3-color");

let marker4Select = document.querySelector("#b4-select");
let marker4Tools = document.querySelector("#b4-tools");
let marker4Slider = document.querySelector("#b4-slider");
let marker4Color = document.querySelector("#b4-color");

let marker5Select = document.querySelector("#b5-select");
let marker5Tools = document.querySelector("#b5-tools");
let marker5Slider = document.querySelector("#b5-slider");
let marker5Color = document.querySelector("#b5-color");

let randomXY = document.querySelector("#randomXY");



function setup() {
  canvas = createCanvas(frameDim, frameDim + 80);

  canvas.id('animation');

  //ui.prepend(canvas.elt);
  timeline.prepend(canvas.elt);
  canvas.background(204);

  for (let i = 0; i < numFrames; i++) {
    frames[i] = createGraphics(frameDim * dpi, frameDim * dpi);
  }

  for (let i = 0; i < numMarkerFrames; i++) {
    markerFrames[i] = createGraphics(frameDim * dpi, frameDim * dpi);
  }

  backgroundFrame = createGraphics(frameDim * dpi, frameDim * dpi);
  backgroundFrame.background(0, 0, 102);

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
  let marker1 = marker1Select.checked;
  let marker2 = marker2Select.checked;
  let marker3 = marker3Select.checked;
  let marker4 = marker4Select.checked;
  let marker5 = marker5Select.checked;

  //console.log(b1OnOff);

  // Draw the time line to set the boolean values for
  // frames on and off before frames are drawn into
  timeLineH();

  let whichTool;

  let markFunctions = [ mark1, mark2, mark3, mark4, mark5 ];

  let rxy = parseInt(randomXY.value);

  rx = 0;
  ry = 0;

  if (rxy !== 0) {
    rx = random(-rxy, rxy);
    ry = random(-rxy, rxy);
  }

  if (startDrawing) {
    for (let i = firstFrame; i < lastFrame; i++) {
      if (onFrame[i] || i === currentFrame) {
        if (marker1) {
          whichTool = parseInt(marker1Tools.value);
          markFunctions[whichTool-1](0, "#FFFFFF", parseInt(marker1Slider.value));
        }
        if (marker2) {
          whichTool = parseInt(marker2Tools.value);
          markFunctions[whichTool-1](1, "#FF0000", parseInt(marker2Slider.value));
        }
        if (marker3) {
          whichTool = parseInt(marker3Tools.value);
          markFunctions[whichTool-1](2, "#00CC00", parseInt(marker3Slider.value));
        }
        if (marker4) {
          whichTool = parseInt(marker4Tools.value);
          markFunctions[whichTool-1](3, "#000000", parseInt(marker4Slider.value));
        }
        if (marker5) {
          whichTool = parseInt(marker5Tools.value);
          markFunctions[whichTool-1](4, "#FFCC00", parseInt(marker5Slider.value));
        }
      }
    }
  }

  image(backgroundFrame, 0, 0, 512, 512);
  image(frames[currentFrame], 0, 0, 512, 512);
  for (let i = numMarkerFrames-1; i >= 0; i--) {
    image(markerFrames[i], 0, 0, 512, 512);
  }

  if (startDrawing) {
    pmx = mx + rx;
    pmy = my + ry;
  }

  if (!pause) {
    if (millis() > lastTime + timeStep) {

      writeMarkersIntoFrames();

      // Go to the next frame
      currentFrame++;

      if (currentFrame >= lastFrame) {
        currentFrame = firstFrame;
      }
      lastTime = millis();
    }
  }
}

function writeMarkersIntoFrames() {
  // Write all "marker frames" into the current frame
  // and erase each right after it's written
  for (let i = numMarkerFrames-1; i >= 0; i--) {
    frames[currentFrame].image(markerFrames[i], 0, 0, 512, 512);
    markerFrames[i].clear();
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
        currentFrame = lastFrame - 1;
      }
    }
  }
  if (key === 'c' || key === 'C') {
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
  writeMarkersIntoFrames();
}

function windowResized() {
  //resizeCanvas(windowWidth, windowHeight);
  //resizeGUI();
}