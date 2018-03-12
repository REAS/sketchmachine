let selectLastFrame = false;
let selectFirstFrame = false;
let masterSelect = false;

function selectRange (sketch) {

  masterSelect = !masterSelect;

  if (!masterSelect) {
    // First, deselect all
    deselect();
    if (pause) {
      displayTimeline(timelineSketch);
    }
  } else {
    // First, deselect all
    deselect();
    // Second, select the new range
    for (let i = firstFrame; i < lastFrame; i++) {
      onFrame[i] = true;
    }
    if (pause) {
      displayTimeline(timelineSketch);
    }
  }
}

function deselect (sketch) {
  for (let i = 0; i < numFrames; i++) {
    onFrame[i] = false;
  }
}

function manageSelection (sketch) {
  if (masterSelect) {
    deselect();
    for (let i = firstFrame; i < lastFrame; i++) {
      onFrame[i] = true;
    }
  }
}


function displayTimeline (sketch) {

  sketch.drawingContext.clearRect(0, 0, sketch.width, sketch.height);

  let tw = frameDim / numFrames;
  let ty = 16;  // Gap from the top of the canvas
  let tlh = 40;  // Height of the time line -- Increased for better touch on mobile
  let th = 40;  // Height of the selection arrows

  let tx = sketch.map(currentFrame, 0, numFrames, 0, sketch.width);

  if (!startDrawing) {
    for (let x = firstFrame; x < lastFrame; x++) {
      let xx = sketch.map(x, 0, numFrames, 0, sketch.width);
      if ((sketch.mouseX > xx && sketch.mouseX < xx + tw && sketch.mouseY > ty && sketch.mouseY < ty + tlh)) {
        if (sketch.mouseIsPressed && sketch.mouseY >= ty && sketch.mouseY <= ty + tlh && !selectFirstFrame && !selectLastFrame && !timelineRangeLock) {
          if (!pause) {
            clickPlay()
          }
          currentFrame = x;
          displayFrame(animationSketch);
          arrowLock = true;
        }
      }
    }
  }

  // DRAW FRAMES THAT ARE "ON", THAT ARE CURRENTLY BEING DRAWING INTO
  for (let i = firstFrame; i < lastFrame; i++) {
    if (onFrame[i]) {
      let tempx = sketch.map(i, 0, numFrames, 0, sketch.width);
      sketch.noStroke();
      //sketch.fill(126, 126, 126);
      sketch.fill(0, 0, 255);
      sketch.rect(tempx, ty, tw, tlh + 1);
    }
  }

  // CURRENT FRAME MARKER IN BRIGHT BLUE
  sketch.noStroke();
  //if (!masterSelect) {
    sketch.fill(0, 0, 255);
  //} else {
  //  sketch.fill(255);
  //}
  sketch.rect(tx, ty, tw, tlh+1);

  // RANGE OF FRAMES, FIRST TO LAST
  let tty = ty+tlh+6;
  //let tty = ty;
  let ffx = firstFrame * tw;
  let lfx = (lastFrame - 1) * tw;

  // CONNECT IN AND OUT MARKERS
  sketch.stroke(102);
  sketch.line(firstFrame * tw + tw - 1, tty + th / 2, (lastFrame - 1) * tw, tty + th / 2);

  // IN MARKER
  sketch.fill(51); // Default color overwritten with blue if mouse is over
  sketch.noStroke();
  if (sketch.mouseX > ffx && sketch.mouseX < ffx + tw && sketch.mouseY > tty && sketch.mouseY < tty + th) {
    if (!startDrawing) {
      if (sketch.mouseIsPressed && !selectLastFrame && !arrowLock && !timelineRangeLock) {
        selectFirstFrame = true;  // Goes "false" in mouseReleased
        //
      }
      if (!selectLastFrame && !arrowLock) {
        sketch.fill(0, 0, 255);
      }
    }
  }
  if (selectFirstFrame) {
    firstFrame = sketch.floor(sketch.mouseX / tw);
    firstFrame = sketch.constrain(firstFrame, 0, lastFrame - 2);
    if (currentFrame < firstFrame) {
      currentFrame = firstFrame;
    }
    sketch.fill(0, 0, 255);
    manageSelection();
  }
  sketch.triangle(firstFrame * tw, tty, firstFrame * tw, tty + th, (firstFrame + 1) * tw, tty + th / 2);

  // OUT MARKER
  sketch.fill(51);
  if (sketch.mouseX > lfx && sketch.mouseX < lfx + tw && sketch.mouseY > tty && sketch.mouseY < tty + th) {
    if (!startDrawing) {
      if (sketch.mouseIsPressed && !selectFirstFrame && !arrowLock && !timelineRangeLock) {
        selectLastFrame = true;  // Goes "false" in mouseReleased
      }
      if (!selectFirstFrame && !arrowLock){
        sketch.fill(0, 0, 255);
      }
    }
  }
  if (selectLastFrame) {
    lastFrame = sketch.ceil(sketch.mouseX / tw);
    lastFrame = sketch.constrain(lastFrame, firstFrame + 2, numFrames);
    if (currentFrame > lastFrame - 1) {
      currentFrame = lastFrame - 1;
    }
    sketch.fill(0, 0, 255);
    manageSelection();
  }
  sketch.triangle(lastFrame * tw, tty, lastFrame * tw, tty + th, (lastFrame - 1) * tw, tty + th / 2);

  // BETWEEN THE IN AND OUT MARKER
  if (sketch.mouseX > ffx + tw && sketch.mouseX < lfx && sketch.mouseY > tty && sketch.mouseY < tty + th && !selectFirstFrame && !selectLastFrame) {
    if (!startDrawing && !arrowLock) {
      timelineRangeSelected = true;
      if (sketch.mouseIsPressed && !timelineRangeLock) {
        timelineRangeLock = true;
        let currentX = sketch.ceil(sketch.map(sketch.mouseX, 0, sketch.width, 0, numFrames));
        numToLeft = currentX-firstFrame;
        numToRight = lastFrame-currentX;
      }
    }
  } else {
    timelineRangeSelected = false;
  }

  if (timelineRangeSelected || timelineRangeLock) {
    sketch.fill(153, 153, 153);
    sketch.noStroke();
    sketch.rect(ffx, tty, lfx-ffx+tw, th);
    // Hack to draw the blue arrows on top, as well as the connecting line
    sketch.fill(0, 0, 255);
    sketch.triangle(lastFrame * tw, tty, lastFrame * tw, tty + th, (lastFrame - 1) * tw, tty + th / 2);
    sketch.triangle(firstFrame * tw, tty, firstFrame * tw, tty + th, (firstFrame + 1) * tw, tty + th / 2);
    sketch.stroke(102);
    sketch.line(firstFrame * tw + tw - 1, tty + th / 2, (lastFrame - 1) * tw, tty + th / 2);
  }

  // Calculate the "range" change if it's selected and locked
  if (timelineRangeLock) {

    //manageSelection();

    let currentX = sketch.ceil(sketch.map(sketch.mouseX, 0, sketch.width, 0, numFrames));
    let newX = sketch.map(currentX, 0, numFrames, 0, sketch.width);

    firstFrame = currentX - numToLeft;
    lastFrame = currentX + numToRight;

    manageSelection();

    firstFrame = sketch.constrain(firstFrame, 0, numFrames-2);
    lastFrame = sketch.constrain(lastFrame, 2, numFrames);

    if (currentFrame < firstFrame) {
      currentFrame = firstFrame;
    }

    if (currentFrame > lastFrame-1) {
      currentFrame = lastFrame-1;
    }

    //sketch.print(currentX, firstFrame, lastFrame, numToLeft, numToRight);

    // Comment this bit out when it's working
    //sketch.stroke(255, 0, 0);
    //sketch.line(sketch.mouseX, 0, sketch.mouseX, sketch.height);
    //sketch.stroke(0, 255, 0);
    //sketch.line(newX, 0, newX, sketch.height);
  }

  // TICK MARKS, THE GRID OF FRAMES
  let tickMiddle = ty+tlh/2;
  for (let x = 0; x <= numFrames; x++) {

    let xx = sketch.map(x, 0, numFrames, 0, sketch.width);
    if (x === numFrames) {
      xx = xx-1;
    }
    if (x < firstFrame || x > lastFrame) {
      sketch.stroke(102);
      sketch.line(xx, tickMiddle-2, xx, tickMiddle+2);
    } else {
      sketch.stroke(0);
      sketch.line(xx, ty, xx, ty + tlh);
    }
  }

}
