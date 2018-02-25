let selectLastFrame = false;
let selectFirstFrame = false;

function displayTimeline (sketch) {

  sketch.drawingContext.clearRect(0, 0, sketch.width, sketch.height)

  let tw = frameDim / numFrames;
  let ty = 10;
  let th = 40;  // Time line height
  let th2 = th * 2;

  let tx = sketch.map(currentFrame, 0, numFrames, 0, sketch.width);

  // CURRENT FRAME MARKER ARROW
  let tfmy = ty + th * 3 - th / 4;

  if (!startDrawing) {
    for (let x = firstFrame; x < lastFrame; x++) {
      let xx = sketch.map(x, 0, numFrames, 0, sketch.width);
      if ((sketch.mouseX > xx && sketch.mouseX < xx + tw && sketch.mouseY > ty + th && sketch.mouseY < tfmy + th / 2)) {
        sketch.noStroke();
        sketch.fill(255, 0, 0);
        //rect(xx, tfmy , tw+1, th);
        sketch.triangle(xx, tfmy, xx + tw + 1, tfmy, xx + tw / 2, tfmy - th / 2);
        if (sketch.mouseIsPressed && sketch.mouseY >= ty + th && sketch.mouseY <= sketch.height) {
          if(!pause) {
            clickPlay()
          }
          currentFrame = x;
          arrowLock = true;
        }
      }
    }
  }

  sketch.fill(0, 0, 255);
  sketch.noStroke();
  sketch.triangle(tx, tfmy, tx + tw + 1, tfmy, tx + tw / 2, tfmy - tw);

  /*
  // HIGHLIGHT FRAMES TO DRAW INTO
  stroke(0);
  let i = 0;
  for (let x = 0; x < numFrames; x++) {
    let xx = map(x, 0, numFrames, 0, width);

    if (!startDrawing) {

      overFrame[i] = false;
      if ((mouseX > xx && mouseX < xx + tw && mouseY > ty + th && mouseY < ty + th * 2) && !selectFirstFrame && !selectLastFrame) {
        overFrame[i] = true;
        if (mouseIsPressed) {
          if (firstClick) {
            //console.log("start the line...");
            //frameSelectLock = true;
            if (onFrame[i] == false) {
              addMode = true;
            } else {
              addMode = false;
            }
            firstClick = false;
          }
          if (addMode) {
            onFrame[i] = true;
          } else {
            onFrame[i] = false;
          }
        } else {
          firstClick = true;
        }

      }
    }

    noStroke();
    if (overFrame[i]) {
      fill(255, 0, 0);
      rect(xx, ty + th, tw, th);
    } else if (onFrame[i]) {
      if (i >= firstFrame && i < lastFrame) {
        fill(0, 0, 255)
      } else {
        fill(102);
      }
      rect(xx, ty + th, tw, th);
    }

    i++;
  }
  */

  // CURRENT FRAME MARKER (MIDDLE)
  sketch.fill(0, 0, 255);
  sketch.rect(tx, ty + th, tw, th);

  // RANGE OF FRAMES, FIRST TO LAST
  let tty = ty + 6 - th / 4;
  let ffx = firstFrame * tw;
  let lfx = (lastFrame - 1) * tw;

  // CONNECT IN AND OUT MARKERS
  sketch.stroke(102);
  sketch.line(firstFrame * tw + tw - 1, tty + th / 2, (lastFrame - 1) * tw, tty + th / 2);

  // IN MARKER
  sketch.fill(102);
  sketch.noStroke();
  if (sketch.mouseX > ffx && sketch.mouseX < ffx + tw && sketch.mouseY > tty && sketch.mouseY < tty + th && !selectLastFrame) {
    if (!startDrawing) {
      if (sketch.mouseIsPressed && !selectLastFrame) {
        selectFirstFrame = true;  // Goes "false" in mouseReleased
      }
      sketch.fill(255, 0, 0);
    }
  }
  if (selectFirstFrame) {
    firstFrame = sketch.floor(sketch.mouseX / tw);
    firstFrame = sketch.constrain(firstFrame, 0, lastFrame - 2);
    if (currentFrame < firstFrame) {
      currentFrame = firstFrame;
    }
    sketch.fill(255, 0, 0);
  }
  sketch.triangle(firstFrame * tw, tty, firstFrame * tw, tty + th, (firstFrame + 1) * tw, tty + th / 2);

  // OUT MARKER
  sketch.fill(102);
  if (sketch.mouseX > lfx && sketch.mouseX < lfx + tw && sketch.mouseY > tty && sketch.mouseY < tty + th && !selectFirstFrame) {
    if (!startDrawing) {
      sketch.fill(255, 0, 0);
      if (sketch.mouseIsPressed && !selectFirstFrame) {
        selectLastFrame = true;  // Goes "false" in mouseReleased
      }
    }
  }
  if (selectLastFrame) {
    lastFrame = sketch.ceil(sketch.mouseX / tw);
    lastFrame = sketch.constrain(lastFrame, firstFrame + 2, numFrames);
    if (currentFrame > lastFrame - 1) {
      currentFrame = lastFrame - 1;
    }
    sketch.fill(255, 0, 0);
  }
  sketch.triangle(lastFrame * tw, tty, lastFrame * tw, tty + th, (lastFrame - 1) * tw, tty + th / 2);

  // TICK MARKS, THE GRID OF FRAMES
  sketch.stroke(0);
  for (let x = 0; x <= numFrames; x++) {
    let xx = sketch.map(x, 0, numFrames, 0, sketch.width);
    sketch.line(xx, ty + th, xx, ty + th2);
  }
  sketch.line(frameDim-1, ty + th, frameDim-1, ty + th2);
}
