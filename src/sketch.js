let canvas;
let frames = [];
let backgroundFrame;
let markerFrames = [];
let compositeFrame;
let exportFrame;

let numFrames = 36; // 48
let numMarkerFrames = 5;
let firstFrame = 12; //18;
let lastFrame = 24; //30;
let currentFrame = firstFrame;

let frameDim = 512;
let surfaceDim = Math.min(1024, 512 * window.devicePixelRatio);
let resInt = parseInt(window.location.search.replace('?res=', ''));
if (resInt) { surfaceDim = Math.min(1024, resInt); }

let frameSurfaceRatio = frameDim / surfaceDim;

let lastTime = 0;
let timeStep = 500; // In milliseconds

let pause = false;
let startDrawing = false;
let didDrawAnything = false;

let mobile = false; // Global variable, if on phone or not

let mx, my, pmx, pmy = 0;
let rx, ry, prx, pry = 0;
let targetX, targetY = 0;

let currentColor = "#FFFFFF";
let currentColorSelection = 1;

const ui = document.querySelector('#ui');
const sketchContainer = document.querySelector('#sketch-container');
const speedSlider = document.querySelector('#speed');

const colorSelector = document.querySelector('#color-selector');
const backgroundColorSelector = document.querySelector('#background-color-selector');
const backgroundColorButton = document.querySelector('#background-color-button');

let speedSize = false;
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
const fpsOptions = [17, 20, 25, 33, 42, 80, 125, 250, 500, 1000];

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
let backgroundEnabled = true;
let randomXY = document.querySelector("#randomXY");
let markers = [false, false, false, false, false];

let timelineCanvas;

const animationSketch = new p5(function (sketch) {
  sketch.setup = function() {
    sketch.pixelDensity(window.devicePixelRatio);
    canvas = sketch.createCanvas(frameDim, frameDim);
    sketch.noSmooth();

    canvas.id('animation');

    sketchContainer.prepend(canvas.elt);
    canvas.background(204);

    marker1Color = "#FFFFFF";
    marker2Color = web216[sketch.int(sketch.random(web216.length))];
    marker3Color = web216[sketch.int(sketch.random(web216.length))];
    marker4Color = web216[sketch.int(sketch.random(web216.length))];
    marker5Color = web216[sketch.int(sketch.random(web216.length))];

    marker1ColorButton.style.backgroundColor = marker1Color;
    marker2ColorButton.style.backgroundColor = marker2Color;
    marker3ColorButton.style.backgroundColor = marker3Color;
    marker4ColorButton.style.backgroundColor = marker4Color;
    marker5ColorButton.style.backgroundColor = marker5Color;

    backgroundColor = "#000000"; //web216[int(random(web216.length))];
    backgroundColorButton.style.backgroundColor = backgroundColor;

    sketch.pixelDensity(1);

    for (let i = 0; i < numFrames; i++) {
      frames[i] = sketch.createGraphics(surfaceDim, surfaceDim);
    }

    for (let i = 0; i < numMarkerFrames; i++) {
      markerFrames[i] = sketch.createGraphics(surfaceDim, surfaceDim);
    }

    compositeFrame = sketch.createGraphics(surfaceDim, surfaceDim);
    exportFrame = sketch.createGraphics(surfaceDim, surfaceDim);

    backgroundFrame = sketch.createGraphics(surfaceDim, surfaceDim);
    backgroundFrame.background(backgroundColor);

    sketch.pixelDensity(window.devicePixelRatio);

    lastTime = sketch.millis();
  };

  sketch.draw = function () {
    if (startDrawing) {

      if (smoothing) {
        targetX = Math.floor((sketch.mouseX - 4) / frameSurfaceRatio)
        targetY = Math.floor((sketch.mouseY - 4) / frameSurfaceRatio)
      } else {
        mx = Math.floor((sketch.mouseX - 4) / frameSurfaceRatio)
        my = Math.floor((sketch.mouseY - 4) / frameSurfaceRatio)
      }
    }

    // TIMELINE
    timeStep = fpsOptions[parseInt(speedSlider.value)-1];

    // MARKERS
    markers[0] = marker1Select.checked;
    markers[1] = marker2Select.checked;
    markers[2] = marker3Select.checked;
    markers[3] = marker4Select.checked;
    markers[4] = marker5Select.checked;

    let whichTool;

    let markFunctions = [ mark1, mark2, mark3 ];

    let rxy = parseInt(randomXY.value);

    rx = 0;
    ry = 0;

    let tempEasing = parseInt(easingSlider.value);
    if (tempEasing > 0) {
      easing = sketch.map(tempEasing, 0, 100, 0.1, 0.01);
      smoothing = true;
    } else {
      smoothing = false;
    }

    if (rxy !== 0) {
      rx = sketch.random(-rxy, rxy);
      ry = sketch.random(-rxy, rxy);
    }

    if (startDrawing) {
      if (markers[0]) {
        whichTool = parseInt(marker1Tools.value);
        markFunctions[whichTool - 1](sketch, 0, marker1Color, calculateThickness(marker1Slider.value));
        didDrawAnything = true
      }
      if (markers[1]) {
        whichTool = parseInt(marker2Tools.value);
        markFunctions[whichTool - 1](sketch, 1, marker2Color, calculateThickness(marker2Slider.value));
        didDrawAnything = true
      }
      if (markers[2]) {
        whichTool = parseInt(marker3Tools.value);
        markFunctions[whichTool - 1](sketch, 2, marker3Color, calculateThickness(marker3Slider.value));
        didDrawAnything = true
      }
      if (markers[3]) {
        whichTool = parseInt(marker4Tools.value);
        markFunctions[whichTool - 1](sketch, 3, marker4Color, calculateThickness(marker4Slider.value));
        didDrawAnything = true
      }
      if (markers[4]) {
        whichTool = parseInt(marker5Tools.value);
        markFunctions[whichTool - 1](sketch, 4, marker5Color, calculateThickness(marker5Slider.value));
        didDrawAnything = true
      }
    }

    // Now, finally, draw the animation to the screen
    if (!pause || startDrawing) {
      displayFrame(sketch)
    }

    if (startDrawing) {
      pmx = mx;
      pmy = my;
      prx = rx;
      pry = ry;
    }

    if (!pause) {
      if (sketch.millis() > lastTime + timeStep) {
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
        lastTime = sketch.millis();
      }
    }
  };

  // Define an abstract pointer device
  function pointerPressed (e) {

    // Cancel event if not clicking inside a sketch.
    if (e.target !== canvas.elt && e.target !== timelineCanvas.elt) {
      return
    }

    e.target.focus()

    // If click in animation area
    if (sketch.mouseX > 0 && sketch.mouseX < sketch.width && sketch.mouseY > 0 && sketch.mouseY < sketch.height) {
      startDrawing = true;
      lastLineFrames = []
      lastPointFrames = []
      lastQuadFrames = []
      pmx = Math.floor((sketch.mouseX - 4) / frameSurfaceRatio)
      pmy = Math.floor((sketch.mouseY - 4) / frameSurfaceRatio)
      if (smoothing) {
        mx = pmx;
        my = pmy;
      }
    }
  }

  function pointerReleased() {
    startDrawing = false;
    selectFirstFrame = false;
    selectLastFrame = false;
    writeMarkersIntoFrames();
  }

  sketch.mousePressed = (e) => { pointerPressed(e) };
  sketch.mouseReleased = () => { pointerReleased() };

  sketch.touchStarted = (e) => { pointerPressed(e) };

  sketch.touchMoved = (e) => {
    if (startDrawing && e.touches && e.touches.length === 1) { // Prevent pan gesture on mobile
      e.preventDefault();
    }
  };

  sketch.touchReleased = () => { pointerReleased() };
});

const timelineSketch = new p5(function (sketch) {
  sketch.setup = function () {
    sketch.pixelDensity(window.devicePixelRatio);
    timelineCanvas = sketch.createCanvas(frameDim, 75);
    timelineCanvas.id('timeline');
    sketchContainer.append(timelineCanvas.elt);
    sketch.noSmooth();
  }

  sketch.draw = function () {
    if (!pause || sketch.mouseIsPressed) {
      displayTimeline(sketch)
    }
  }

  sketch.mouseMoved = function () {
    if (sketch.mouseX > 0 && sketch.mouseX < sketch.width && sketch.mouseY > 0 && sketch.mouseY < sketch.height) {
      displayTimeline(sketch)
    }
  }
});

function displayFrame (sketch) {
  canvas.drawingContext.clearRect(0, 0, sketch.width, sketch.height)
  if (backgroundEnabled === true) {
    backgroundFrame.background(backgroundColor)
    sketch.drawingContext.drawImage(backgroundFrame.canvas, 0, 0, frameDim, frameDim)
  }
  sketch.drawingContext.drawImage(frames[currentFrame].canvas, 0, 0, frameDim, frameDim)
  for (let i = numMarkerFrames-1; i >= 0; i--) {
    sketch.drawingContext.drawImage(markerFrames[i].canvas, 0, 0, frameDim, frameDim)
  }

  if (pause && onionSkin) {
    sketch.drawingContext.globalAlpha = 0.5
    if (currentFrame > firstFrame) {
      sketch.drawingContext.drawImage(frames[currentFrame - 1].canvas, 0, 0, frameDim, frameDim);
    } else if (currentFrame === firstFrame) {
      sketch.drawingContext.drawImage(frames[lastFrame - 1].canvas, 0, 0, frameDim, frameDim);
    }
    sketch.drawingContext.globalAlpha = 1.0
  }
}

function writeMarkersIntoFrames () {
  // Composite each layer into one, then erase in turn
  for (let i = numMarkerFrames - 1; i >= 0; i--) {
    if (markers[i]) {
      compositeFrame.drawingContext.drawImage(markerFrames[i].canvas, 0, 0, surfaceDim, surfaceDim)
      markerFrames[i].drawingContext.clearRect(0, 0, surfaceDim, surfaceDim)
    }
  }

  // Write all "marker frames" composites into the selected frames
  for (let i = firstFrame; i < lastFrame; i++) {
    if (onFrame[i] || i === currentFrame) {
      frames[i].drawingContext.drawImage(compositeFrame.canvas, 0, 0, surfaceDim, surfaceDim)
    }
  }
  compositeFrame.drawingContext.clearRect(0, 0, surfaceDim, surfaceDim);
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

  if (e.keyCode === 37) { // Left arrow
    if (!pause) { clickPlay() } else {
      clickBack()
    }
    e.preventDefault();
  }
  if (e.keyCode === 39) { // Right arrow
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

function calculateThickness(t) {
  return Math.max(1, Math.floor(parseInt(t) / frameSurfaceRatio))
}

// GIF Export
const exportButton = document.getElementById('export-button')
const exportOverlay = document.getElementById('export-overlay')
const exportedGIFSpinner = document.getElementById('exported-gif-spinner')
const exportedGIFImg = document.getElementById('exported-gif-img')

function renderFrameGIF (gif, i) {
  if (backgroundEnabled === true) {
    exportFrame.drawingContext.drawImage(backgroundFrame.canvas, 0, 0, surfaceDim, surfaceDim);
  } else {
    exportFrame.drawingContext.clearRect(0, 0, surfaceDim, surfaceDim);
  }
  exportFrame.drawingContext.drawImage(frames[i].canvas, 0, 0, surfaceDim, surfaceDim);
  gif.addFrame(exportFrame.canvas, {delay: timeStep * 2, copy: true});
}

function exportGIF () {

  if (didDrawAnything === false) {
    alert("You haven't drawn anything to export.")
    return
  }

  if(!pause) { clickPlay() }

  exportOverlay.classList.add('active');
  exportButton.classList.add('active');
  document.body.classList.add('noscroll');

  let isTransparent = null
  if (backgroundEnabled === false) { isTransparent = 0x000000 }

  const gif = new GIF({
    workers: 4,
    quality: 10,
    background: backgroundColor,
    transparent: isTransparent,
    workerScript: "vendor/gif.worker.js"
  });

  switch(playbackMode) {
    case FORWARD:
      for (let i = firstFrame; i < lastFrame; i += 1) { renderFrameGIF(gif, i) }
      break;
    case REVERSE:
      for (let i = lastFrame - 1; i > firstFrame; i -= 1) { renderFrameGIF(gif, i) }
      break;
    case BACKANDFORTH:
      for (let i = firstFrame; i < lastFrame; i += 1) { renderFrameGIF(gif, i) }
      for (let i = lastFrame - 2; i >= firstFrame + 1; i -= 1) { renderFrameGIF(gif, i) }
      break;
  }

  gif.on('finished', function(blob) {
    if (exportOverlay.classList.contains('active')) {
      exportedGIFImg.onload = function () {
        exportedGIFImg.classList.add('active');
        exportedGIFSpinner.classList.add('hidden')
      }
      exportedGIFImg.src = URL.createObjectURL(blob);
    }
  });

  gif.render()
}

exportOverlay.onclick = (e) => {
  cancelOrCloseGIF()
}

function cancelOrCloseGIF () {
  exportOverlay.classList.remove('active');
  exportButton.classList.remove('active');
  exportedGIFSpinner.classList.remove('hidden')
  exportedGIFImg.classList.remove('active');
  document.body.classList.remove('noscroll');
}

// Leave page warning
window.onbeforeunload = (e) => {
  if (didDrawAnything) {
    return true
  }
}