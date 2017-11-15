

/**
 * TODO
 * Onion skin?
 */

let canvas;

let frames = [];
let backgroundFrame;
let markerFrames = [];
let compositeFrame;

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

let colorActive = false;
let currentColor = "#FFFFFF";
let currentColorSelection = 1;

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

let playbackDirection = 1;

const ONCE = 0;
const LOOP = 1;
const BACKANDFORTH = 2;

let playbackMode = LOOP;

// "MARKERS"

/*
class Marker {
  constructor() {
    this.on = false;

  }
  on: false;
  select: 1;
  tools = 1;
  slider = 1;
  color = "#FFOOOO";
}

let markers = [];
let markers[0] = new maker();
let markers[0].select = document.querySelector("#b1-select");
*/

let marker1Select = document.querySelector("#b1-select");
let marker1Tools = document.querySelector("#b1-tools");
let marker1Slider = document.querySelector("#b1-slider");
let marker1ColorButton = document.querySelector("#b1-color");
let marker1Color = 0;

let marker2Select = document.querySelector("#b2-select");
let marker2Tools = document.querySelector("#b2-tools");
let marker2Slider = document.querySelector("#b2-slider");
let marker2ColorButton = document.querySelector("#b2-color");
let marker2Color = 0;

let marker3Select = document.querySelector("#b3-select");
let marker3Tools = document.querySelector("#b3-tools");
let marker3Slider = document.querySelector("#b3-slider");
let marker3ColorButton = document.querySelector("#b3-color");
let marker3Color = 0;

let marker4Select = document.querySelector("#b4-select");
let marker4Tools = document.querySelector("#b4-tools");
let marker4Slider = document.querySelector("#b4-slider");
let marker4ColorButton = document.querySelector("#b4-color");
let marker4Color = 0;

let marker5Select = document.querySelector("#b5-select");
let marker5Tools = document.querySelector("#b5-tools");
let marker5Slider = document.querySelector("#b5-slider");
let marker5ColorButton = document.querySelector("#b5-color");
let marker5Color = 0;

let randomXY = document.querySelector("#randomXY");

/*
let marker1 = false;
let marker2 = false;
let marker3 = false;
let marker4 = false;
let marker5 = false;
*/

let markers = [false, false, false, false, false];



function setup() {
  canvas = createCanvas(frameDim, frameDim + 80);

  canvas.id('animation');

  //ui.prepend(canvas.elt);
  timeline.prepend(canvas.elt);
  canvas.background(204);

  marker1Color = "#FFFFFF";
  marker2Color = "#FF0000";
  marker3Color = "#00CC00";
  marker4Color = "#000000";
  marker5Color = "#FFCC00";

  marker1ColorButton.style.backgroundColor = marker1Color;
  marker2ColorButton.style.backgroundColor = marker2Color;
  marker3ColorButton.style.backgroundColor = marker3Color;
  marker4ColorButton.style.backgroundColor = marker4Color;
  marker5ColorButton.style.backgroundColor = marker5Color;

  for (let i = 0; i < numFrames; i++) {
    frames[i] = createGraphics(frameDim * dpi, frameDim * dpi);
    //frames[i] = createGraphics(frameDim * 1, frameDim * 1);
  }

  for (let i = 0; i < numMarkerFrames; i++) {
    markerFrames[i] = createGraphics(frameDim * dpi, frameDim * dpi);
    //markerFrames[i] = createGraphics(frameDim * 1, frameDim * 1);
  }

  backgroundFrame = createGraphics(frameDim * dpi, frameDim * dpi);
  //backgroundFrame = createGraphics(frameDim * 1, frameDim * 1);
  backgroundFrame.background(0, 0, 255);

  compositeFrame = createGraphics(frameDim * dpi, frameDim * dpi);


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
  markers[0] = marker1Select.checked;
  markers[1] = marker2Select.checked;
  markers[2] = marker3Select.checked;
  markers[3] = marker4Select.checked;
  markers[4] = marker5Select.checked;

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

  if (startDrawing && !colorActive) {
    if (markers[0]) {
      whichTool = parseInt(marker1Tools.value);
      markFunctions[whichTool - 1](0, marker1Color, parseInt(marker1Slider.value));
    }
    if (markers[1]) {
      whichTool = parseInt(marker2Tools.value);
      markFunctions[whichTool - 1](1, marker2Color, parseInt(marker2Slider.value));
    }
    if (markers[2]) {
      whichTool = parseInt(marker3Tools.value);
      markFunctions[whichTool - 1](2, marker3Color, parseInt(marker3Slider.value));
    }
    if (markers[3]) {
      whichTool = parseInt(marker4Tools.value);
      markFunctions[whichTool - 1](3, marker4Color, parseInt(marker4Slider.value));
    }
    if (markers[4]) {
      whichTool = parseInt(marker5Tools.value);
      markFunctions[whichTool - 1](4, marker5Color, parseInt(marker5Slider.value));
    }
  }

  image(backgroundFrame, 0, 0, frameDim, frameDim);
  image(frames[currentFrame], 0, 0, frameDim, frameDim);
  for (let i = numMarkerFrames-1; i >= 0; i--) {
    image(markerFrames[i], 0, 0, frameDim, frameDim);
  }

  if (startDrawing) {
    pmx = mx + rx;
    pmy = my + ry;
  }

  if (!pause) {
    if (millis() > lastTime + timeStep) {

      writeMarkersIntoFrames();

      if (playbackMode === LOOP) {
        currentFrame++;  // Go to the next frame
        if (currentFrame >= lastFrame) {
          currentFrame = firstFrame;
        }
      } else if (playbackMode === ONCE) {
        currentFrame++;  // Go to the next frame
        if (currentFrame >= lastFrame) {
          currentFrame--;
          //pause = true;
          clickPlay();
        }
      } else if (playbackMode === BACKANDFORTH) {
        currentFrame += 1 * playbackDirection;  // Go to the next frame
        if (currentFrame >= lastFrame-1 || currentFrame <= firstFrame) {
          playbackDirection = playbackDirection * -1;
        }
      }

      lastTime = millis();
    }
  }
}

function writeMarkersIntoFrames() {
  // Composite each layer into one, then erase in turn
  for (let i = numMarkerFrames - 1; i >= 0; i--) {
    if (markers[i]) {
      compositeFrame.image(markerFrames[i], 0, 0, frameDim, frameDim);
      markerFrames[i].clear();
    }
  }
  // Write all "marker frames" composites into the selected frames
  for (let i = firstFrame; i < lastFrame; i++) {
    if (onFrame[i] || i === currentFrame) {
      frames[i].image(compositeFrame, 0, 0, frameDim, frameDim);
    }
  }
  compositeFrame.clear();
}

function eraseFrame() {
  frames[currentFrame].clear();
}

function eraseAllFrames() {
  for (let i = 0; i < numFrames; i++) {
    frames[i].clear();
  }
}

function keyPressed() {

  if (key === 'f' || key === 'F') {
    eraseFrame();
  }

  if (key === 'c' || key === 'C') {
    eraseAllFrames();
  }

  // Background color
  if (key === 'b' || key === 'B') {
    openColorSelector();
  }
  //else {
  //  colors.classList.remove('active');
  //}


  if (key === 'p' || key === 'P') {
    clickPlay();
  }

  if (pause) {
    if (keyCode === RIGHT_ARROW) {
      clickNext();
    }
    if (keyCode === LEFT_ARROW) {
      clickBack();
    }
  }

  if (key === 'u' || key === 'U') {
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
