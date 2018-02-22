let canvas;
let frames = [];
let backgroundFrame;
let markerFrames = [];
let compositeFrame;

let numFrames = 36; // 48
let numMarkerFrames = 5;
let firstFrame = 12; //18;
let lastFrame = 24; //30;
let currentFrame = firstFrame;

let frameDim = 512;
// let surfaceDim = 256; // TODO: Add this back in.

let lastTime = 0;
let timeStep = 500; // In milliseconds

let pause = false;
let startDrawing = false;
let didDrawAnything = false;

let mobile = false; // Global variable, if on phone or not

let mx, my, pmx, pmy = 0;
let rx, ry, prx, pry = 0;
let targetX, targetY = 0;

let colorActive = false;
let currentColor = "#FFFFFF";
let currentColorSelection = 1;

const ui = document.querySelector('#ui');
const timeline = document.querySelector('#timeline');
const animationView = document.querySelector('#animation-view');
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
let addMode = true; // Add or remove active frames

let playbackDirection = 1;

const REVERSE = 0;
const FORWARD = 1;
const BACKANDFORTH = 2;

let playbackMode = FORWARD;
const fpsOptions = [17, 20, 25, 33, 42, 12, 125, 250, 500, 1000];

// MARKERS
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

let timeLineCanvas;

function setup() {
  pixelDensity(window.devicePixelRatio);
  canvas = createCanvas(frameDim, frameDim + 75 + 75);
  noSmooth();

  canvas.id('animation');

  animationView.prepend(canvas.elt);
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

  pixelDensity(1);

  for (let i = 0; i < numFrames; i++) {
    frames[i] = createGraphics(frameDim, frameDim);
  }

  for (let i = 0; i < numMarkerFrames; i++) {
    markerFrames[i] = createGraphics(frameDim, frameDim);
  }

  compositeFrame = createGraphics(frameDim, frameDim);

  backgroundFrame = createGraphics(frameDim, frameDim);
  backgroundFrame.background(backgroundColor);

  pixelDensity(window.devicePixelRatio);

  lastTime = millis();
}

function draw() {
  if (startDrawing) {
    //mx = mouseX / dpi;
    //my = mouseY / dpi;
    if (smoothing) {
      targetX = mouseX
      targetY = mouseY
    } else {
      mx = mouseX
      my = mouseY
    }
  }

  canvas.drawingContext.fillStyle = 'rgb(204, 204, 204)'
  canvas.drawingContext.fillRect(0, 0, width, height)

  // TIMELINE
  timeStep = fpsOptions[parseInt(speedSlider.value)-1];

  // MARKERS
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

  // if (frameCount % 60 === 0) {
    // console.log('Easing:', easing);
  // }

  if (rxy !== 0) {
    rx = random(-rxy, rxy);
    ry = random(-rxy, rxy);
  }

  if (startDrawing && !colorActive) {
    if (markers[0]) {
      whichTool = parseInt(marker1Tools.value);
      markFunctions[whichTool - 1](0, marker1Color, parseInt(marker1Slider.value));
      didDrawAnything = true
    }
    if (markers[1]) {
      whichTool = parseInt(marker2Tools.value);
      markFunctions[whichTool - 1](1, marker2Color, parseInt(marker2Slider.value));
      didDrawAnything = true
    }
    if (markers[2]) {
      whichTool = parseInt(marker3Tools.value);
      markFunctions[whichTool - 1](2, marker3Color, parseInt(marker3Slider.value));
      didDrawAnything = true
    }
    if (markers[3]) {
      whichTool = parseInt(marker4Tools.value);
      markFunctions[whichTool - 1](3, marker4Color, parseInt(marker4Slider.value));
      didDrawAnything = true
    }
    if (markers[4]) {
      whichTool = parseInt(marker5Tools.value);
      markFunctions[whichTool - 1](4, marker5Color, parseInt(marker5Slider.value));
      didDrawAnything = true
    }
  }

  backgroundFrame.background(backgroundColor);

  // Now, finally, draw the animation to the screen
  // console.log(backgroundFrame)
  drawingContext.drawImage(backgroundFrame.canvas, 0, 0, frameDim, frameDim)
  drawingContext.drawImage(frames[currentFrame].canvas, 0, 0, frameDim, frameDim)
  for (let i = numMarkerFrames-1; i >= 0; i--) {
    drawingContext.drawImage(markerFrames[i].canvas, 0, 0, frameDim, frameDim)
  }
  if (pause && onionSkin) {
    // tint(255, 102);
    drawingContext.globalAlpha = 0.5
    if (currentFrame > firstFrame) {
      drawingContext.drawImage(frames[currentFrame - 1].canvas, 0, 0, frameDim, frameDim);
    } else if (currentFrame === firstFrame) {
      drawingContext.drawImage(frames[lastFrame - 1].canvas, 0, 0, frameDim, frameDim);
    }
    drawingContext.globalAlpha = 1.0
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
  }

  if (!pause) {
    if (millis() > lastTime + timeStep) {
      writeMarkersIntoFrames();

      if (playbackMode === FORWARD) {
        currentFrame++;  // Go to the next frame
        if (currentFrame >= lastFrame) {
          currentFrame = firstFrame;
        }
      } else if (playbackMode === REVERSE) {
        currentFrame--;  // Go to the next frame
        if (currentFrame < firstFrame) {
          currentFrame = lastFrame - 1;
        }
      } else if (playbackMode === BACKANDFORTH) {
        currentFrame += playbackDirection;  // Go to the next frame
        if (currentFrame >= lastFrame - 1 || currentFrame <= firstFrame) {
          playbackDirection *= -1;
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
      compositeFrame.drawingContext.drawImage(markerFrames[i].canvas, 0, 0, frameDim, frameDim)
      markerFrames[i].drawingContext.clearRect(0, 0, frameDim, frameDim)
    }
  }

  // Write all "marker frames" composites into the selected frames
  for (let i = firstFrame; i < lastFrame; i++) {
    if (onFrame[i] || i === currentFrame) {
      frames[i].drawingContext.drawImage(compositeFrame.canvas, 0, 0, frameDim, frameDim)
    }
  }
  compositeFrame.drawingContext.clearRect(0, 0, frameDim, frameDim);
}

function eraseFrame() {
  frames[currentFrame].clear();
}

function eraseAllFrames() {
  for (let i = 0; i < numFrames; i++) {
    frames[i].clear();
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'f' || e.key === 'F') {
    eraseFrame();
  }

  if (e.key === 'c' || e.key === 'C') {
    eraseAllFrames();
  }

  if (e.key === 'p' || e.key === 'P') {
    clickPlay();
  }

  if (e.keyCode === LEFT_ARROW) {
    if (!pause) { clickPlay() } else {
      clickBack()
    }
    e.preventDefault();
  }
  if (e.keyCode === RIGHT_ARROW) {
    if (!pause) { clickPlay() } else {
      clickNext()
    }
    e.preventDefault();
  }

  if (e.key === 'u' || e.key === 'U') {
    onFrame.fill(false);
  }
  if (e.key === 'a' || e.key === 'A') {
    onFrame.fill(true);
  }

})

// Define an abstract pointer device
function pointerPressed() {
  // If click in animation area
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < width && !colorActive) {
    startDrawing = true;
    pmx = mouseX
    pmy = mouseY
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
  writeMarkersIntoFrames();
}

// Link mouse
function mousePressed() { pointerPressed() }
function mouseReleased() { pointerReleased() }

// Link touch
function touchStarted(e) { pointerPressed() }

function touchMoved(e) {
  if (startDrawing && e.touches && e.touches.length === 1) { // Prevent pan gesture on mobile
    e.preventDefault()
  }
}

function touchReleased() { pointerReleased() }

/*
// GIF Export
function exportGIF () {
  const gif = new GIF({
    workers: 2,
    quality: 10
  });

  // TODO: Add from start frame to end frame, and include ping-ponging.
  gif.addFrame(ctx, {delay: 100, copy: true});

  gif.on('finished', function(blob) {
    window.open(URL.createObjectURL(blob));
  });

  // TODO: Show spinner.
  gif.render()
}
*/

// Leave page warning
window.onbeforeunload = (e) => {
  if (didDrawAnything) {
    return true
  }
}
