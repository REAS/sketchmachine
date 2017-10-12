// python -m SimpleHTTPServer 8000

var canvas;
var frames = [];
var numFrames = 12;
var cf = 0;

var px = 20;
var py = 20;

var lastTime = 0;
var timeStep = 500; //40;  // In milliseconds

var pause = false;

var thickness = 30;

//
var ui = document.querySelector('#ui');
var speedSlider = document.querySelector('#speed-slider');


function setup() {
  canvas = createCanvas(512, 512 + 100);
  
  //canvas.position(px, py);
  canvas.id('animation');

  ui.prepend(canvas.elt);
  canvas.background(204);

  startGUI();

  for (var i = 0; i < numFrames; i++) {
    frames[i] = createGraphics(512, 512);
    frames[i].background(0, 0, 255);
  }

  lastTime = millis();
}

function draw() {

  background(204);
  fill(255);
  noStroke();
  rect(0);

  timeStep = parseInt(speedSlider.value);

  if (mouseIsPressed) {
    frames[cf].fill(255);
    frames[cf].noStroke();
    frames[cf].ellipse(mouseX, mouseY, thickness, thickness);
  }

  image(frames[cf], 0, 0);

  //timeline();
  timelineH();

  if (!pause) {
    if (millis() > lastTime + timeStep) {
      cf++;
      if (cf >= numFrames) {
        cf = 0;
      }
      lastTime = millis();
    }
  }
}

function windowResized() {
  //resizeCanvas(windowWidth, windowHeight);
  resizeGUI();
}