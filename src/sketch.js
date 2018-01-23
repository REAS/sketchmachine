
/**
 * TODO
 * - Modify mouse values for 2X screens (BROKEN NOW)
 * - Touch for mobile
 * - Real color selections screens
 * - Color cycle (random color) options
 * - Onion skin performance issue
 *
 * MAYBE
 * - Other background options: transparent, grid, gradient?
 * - Possible to create a transparent color for erasing? -- first test didn't work...
 * - Add drawing tool selection screen?
 * - Randomize colors button in Modifiers
 * - remove p5.js from the project?
 *
 * DONE
 * x Smoothing
 * x Initialize with random colors
 * x Onion skin (huge performance issue)
 */

let canvas;

let frames = [];
let backgroundFrame;
let markerFrames = [];
let compositeFrame;

let numFrames = 48;
let numMarkerFrames = 5;
let firstFrame = 0//18;
let lastFrame = 48//30;
let currentFrame = firstFrame;

let frameDim = 512;
let surfaceDim = frameDim / 2;
let frameSurfaceRatio = surfaceDim / frameDim

let lastTime = 0;
let timeStep = 500; //40;  // In milliseconds

let pause = false;
let startDrawing = false;

let mobile = false;  // Global variable, if on phone or not

let mx, my, pmx, pmy = 0;
let rx, ry, prx, pry = 0;
let targetX, targetY = 0;

let colorActive = false;
let currentColor = "#FFFFFF";
let currentColorSelection = 1;

//
const ui = document.querySelector('#ui');
const timeline = document.querySelector('#timeline');
const speedSlider = document.querySelector('#speed');

const colorSelector = document.querySelector('#color-selector');
const backgroundColorSelector = document.querySelector('#background-color-selector');
const backgroundColorButton = document.querySelector('#background-color-button');

let speedSize = false;
let triggerColorActive = false;
let onionSkin = false;
let smoothing = false;
let easingSlider = document.querySelector("#easing-slider");
let easing = 0.0;

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

const marker1Select = document.querySelector("#b1-select");
const marker1Tools = document.querySelector("#b1-tools");
const marker1Slider = document.querySelector("#b1-slider");
const marker1ColorButton = document.querySelector("#b1-color");
let marker1Color = 0;

const marker2Select = document.querySelector("#b2-select");
const marker2Tools = document.querySelector("#b2-tools");
const marker2Slider = document.querySelector("#b2-slider");
const marker2ColorButton = document.querySelector("#b2-color");
let marker2Color = 0;

const marker3Select = document.querySelector("#b3-select");
const marker3Tools = document.querySelector("#b3-tools");
const marker3Slider = document.querySelector("#b3-slider");
const marker3ColorButton = document.querySelector("#b3-color");
let marker3Color = 0;

const marker4Select = document.querySelector("#b4-select");
const marker4Tools = document.querySelector("#b4-tools");
const marker4Slider = document.querySelector("#b4-slider");
const marker4ColorButton = document.querySelector("#b4-color");
let marker4Color = 0;

const marker5Select = document.querySelector("#b5-select");
const marker5Tools = document.querySelector("#b5-tools");
const marker5Slider = document.querySelector("#b5-slider");
const marker5ColorButton = document.querySelector("#b5-color");
let marker5Color = 0;

let backgroundColor = 0;

let randomXY = document.querySelector("#randomXY");

let markers = [false, false, false, false, false];

//let firstClickDrawing = false;

function setup() {
  pixelDensity(1);
  canvas = createCanvas(frameDim, frameDim + 75);
  noSmooth();

  canvas.id('animation');

  //ui.prepend(canvas.elt);
  timeline.prepend(canvas.elt);
  canvas.background(204);

  marker1Color = "#FFFFFF"; //web216[int(random(web216.length))];
  marker2Color = web216[int(random(web216.length))];
  marker3Color = web216[int(random(web216.length))];
  marker4Color = web216[int(random(web216.length))];
  marker5Color = web216[int(random(web216.length))];

  marker1ColorButton.style.backgroundColor = marker1Color;
  marker2ColorButton.style.backgroundColor = marker2Color;
  marker3ColorButton.style.backgroundColor = marker3Color;
  marker4ColorButton.style.backgroundColor = marker4Color;
  marker5ColorButton.style.backgroundColor = marker5Color;

  backgroundColor = "#000000"; //web216[int(random(web216.length))];
  backgroundColorButton.style.backgroundColor = backgroundColor;

  for (let i = 0; i < numFrames; i++) {
    frames[i] = createGraphics(surfaceDim, surfaceDim);
  }

  for (let i = 0; i < numMarkerFrames; i++) {
    markerFrames[i] = createGraphics(surfaceDim, surfaceDim);
  }

  compositeFrame = createGraphics(surfaceDim, surfaceDim);

  backgroundFrame = createGraphics(surfaceDim, surfaceDim);
  backgroundFrame.background(backgroundColor);

  lastTime = millis();
}

function draw() {

  if (startDrawing) {
    //mx = mouseX / dpi;
    //my = mouseY / dpi;
    if (smoothing) {
      targetX = mouseX * frameSurfaceRatio;
      targetY = mouseY * frameSurfaceRatio;
    } else {
      mx = mouseX * frameSurfaceRatio;
      my = mouseY * frameSurfaceRatio;
    }
  }

  canvas.drawingContext.fillStyle = 'rgb(204, 204, 204)'
  canvas.drawingContext.fillRect(0, 0, width, height)

  // TIMELINE
  timeStep = parseInt(speedSlider.value);

  // "BRUSHES"
  markers[0] = marker1Select.checked;
  markers[1] = marker2Select.checked;
  markers[2] = marker3Select.checked;
  markers[3] = marker4Select.checked;
  markers[4] = marker5Select.checked;

  let whichTool;

  let markFunctions = [ mark1, mark2, mark3, mark4, mark5 ];

  let rxy = parseInt(randomXY.value);

  rx = 0;
  ry = 0;

  let tempEasing = parseInt(easingSlider.value);
  //easing = 1.0 - parseFloat(easingSlider.value);
  if (tempEasing > 0) {
    easing = map(tempEasing, 0, 100, 0.1, 0.01);
    smoothing = true;
  } else {
    smoothing = false;
  }
  if (frameCount % 60 === 0) {
    console.log('Easing:', easing);
  }

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


  backgroundFrame.background(backgroundColor);

  // Now, finally, draw the animation to the screen


  image(backgroundFrame, 0, 0, frameDim, frameDim);
  image(frames[currentFrame], 0, 0, width, width);
  for (let i = numMarkerFrames-1; i >= 0; i--) {
    image(markerFrames[i], 0, 0, frameDim, frameDim);
  }
  if (pause && onionSkin) {
    tint(255, 102);
    if (currentFrame > firstFrame) {
      image(frames[currentFrame - 1], 0, 0, frameDim, frameDim);
    } else if (currentFrame == firstFrame) {
      image(frames[lastFrame-1], 0, 0, frameDim, frameDim);
    }
    //console.log(currentFrame, firstFrame, lastFrame);
  }

  noTint();

  // Draw the time line to set the boolean values for
  // frames on and off before frames are drawn into
  timeLineH();

  if (startDrawing) {
    pmx = mx;
    pmy = my;
    prx = rx;
    pry = ry;
    //pmx = mx;
    //pmy = my;
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
      compositeFrame.drawingContext.drawImage(markerFrames[i].canvas, 0, 0)
      markerFrames[i].drawingContext.clearRect(0, 0, frameDim, frameDim)
    }
  }

  // Write all "marker frames" composites into the selected frames
  for (let i = firstFrame; i < lastFrame; i++) {
    if (onFrame[i] || i === currentFrame) {
      frames[i].drawingContext.drawImage(compositeFrame.canvas, 0, 0)
    }
  }
  compositeFrame.drawingContext.clearRect(0, 0, frameDim, frameDim)
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

  //console.log(key);
  //console.log("hey");

  if (key === 'f' || key === 'F') {
    eraseFrame();
  }

  if (key === 'c' || key === 'C') {
    eraseAllFrames();
  }

  // Background color
  //if (key === 'b' || key === 'B') {
  //  openColorSelector();
  //}
  //else {
  //  colors.classList.remove('active');
  //}

  if (key === 'p' || key === 'P') {
    clickPlay();
  }

  if (pause) {
    if (keyCode === RIGHT_ARROW) {
      //clickNext();
      currentFrame++;
      if (currentFrame >= lastFrame) {
        currentFrame = firstFrame;
      }
    }
    if (keyCode === LEFT_ARROW) {
      //clickBack();
      currentFrame--;
      if (currentFrame < firstFrame) {
        currentFrame = lastFrame - 1;
      }
    }
  }

  if (key === 'u' || key === 'U') {
    onFrame.fill(false);
  }
  if (key === 'a' || key === 'A') {
    onFrame.fill(true);
  }

}

// Define an abstract pointer device
function pointerPressed() {

  console.log('Pointer pressed:', mouseX, mouseY)

  //firstClickDrawing = true;
  // If click in animation area
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < width && !colorActive) {

    startDrawing = true;
    //pmx = mouseX / dpi;
    //pmy = mouseY / dpi;
    pmx = mouseX * frameSurfaceRatio;
    pmy = mouseY * frameSurfaceRatio;
    if (smoothing) {
      mx = pmx;
      my = pmy;
    }
  }
  if (triggerColorActive) {
    colorActive = false;
    triggerColorActive = false;
  }
}

function pointerReleased() {
  startDrawing = false;
  selectFirstFrame = false;
  selectLastFrame = false;
  //frameSelectLock = false;
  //arrowLock = false;
  writeMarkersIntoFrames();
}

// Link mouse
function mousePressed() { pointerPressed() }
function mouseReleased() { pointerReleased() }

// Link touch
function touchStarted(e) { pointerPressed() }

function touchMoved(e) {
  if (startDrawing && e.touches.length === 1) { // Prevent pan gesture on mobile
    e.preventDefault()
  }
}

function touchReleased() { pointerReleased() }

//function windowResized() {
  //resizeCanvas(windowWidth, windowHeight);
  //resizeGUI();
//}
