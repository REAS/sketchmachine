let selectLastFrame = false;
let selectFirstFrame = false;
//let arrowLock = false;
//let frameSelectLock = false;

function timeLineH() {

  let tw = frameDim / numFrames;
  let ty = frameDim + 10;
  let th = 20;  // Time line height
  let th2 = th * 2;


  // Change the height of the time line elements when running on a phone
  if (mobile) {
    th = 40;
    th2 = th * 2;
  }

  let tx = map(currentFrame, 0, numFrames, 0, width);

  // CURRENT FRAME MARKER ARROW
  //let tfmy = ty - th/4;
  let tfmy = ty + th * 3 - th / 4;

  if (!startDrawing) {
    for (let x = firstFrame; x < lastFrame; x++) {
      let xx = map(x, 0, numFrames, 0, width);
      if ((mouseX > xx && mouseX < xx + tw && mouseY > ty + th && mouseY < tfmy + th / 2)) {
        noStroke();
        fill(255, 0, 0);
        //rect(xx, tfmy , tw+1, th);
        triangle(xx, tfmy, xx + tw + 1, tfmy, xx + tw / 2, tfmy - th / 2);
        if (mouseIsPressed) {
          currentFrame = x;
          arrowLock = true;
        }
      }
    }
  }

  fill(0, 0, 255);
  noStroke();
  //rect(tx, tfmy , tw+1, th);
  triangle(tx, tfmy, tx + tw + 1, tfmy, tx + tw / 2, tfmy - tw);

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
  fill(0, 0, 255);
  rect(tx, ty + th, tw, th);


  // RANGE OF FRAMES, FIRST TO LAST
  let tty = ty - th / 4;
  let ffx = firstFrame * tw;
  let lfx = (lastFrame - 1) * tw;


  // CONNECT IN AND OUT MARKERS
  stroke(102);
  line(firstFrame * tw, tty + th / 2, (  lastFrame - 1) * tw, tty + th / 2);


  // IN MARKER
  fill(102);
  noStroke();
  if (mouseX > ffx && mouseX < ffx + tw && mouseY > tty && mouseY < tty + th && !selectLastFrame) {
    if (!startDrawing) {
      if (mouseIsPressed && !selectLastFrame) {
        selectFirstFrame = true;  // Goes "false" in mouseReleased
      }
      fill(255, 0, 0);
    }
  }
  if (selectFirstFrame) {
    firstFrame = floor(mouseX / tw);
    firstFrame = constrain(firstFrame, 0, lastFrame - 2);
    if (currentFrame < firstFrame) {
      currentFrame = firstFrame;
    }
    fill(255, 0, 0);
  }
  triangle(firstFrame * tw, tty, firstFrame * tw, tty + th, (firstFrame + 1) * tw, tty + th / 2);


  // OUT MARKER
  fill(102);
  if (mouseX > lfx && mouseX < lfx + tw && mouseY > tty && mouseY < tty + th && !selectFirstFrame) {
    if (!startDrawing) {
      fill(255, 0, 0);
      if (mouseIsPressed && !selectFirstFrame) {
        selectLastFrame = true;  // Goes "false" in mouseReleased
      }
    }
  }
  if (selectLastFrame) {
    lastFrame = ceil(mouseX / tw);
    lastFrame = constrain(lastFrame, firstFrame + 2, numFrames);
    if (currentFrame > lastFrame - 1) {
      currentFrame = lastFrame - 1;
    }
    fill(255, 0, 0);
  }
  triangle(lastFrame * tw, tty, lastFrame * tw, tty + th, (lastFrame - 1) * tw, tty + th / 2);


  // TICK MARKS, THE GRID OF FRAMES
  stroke(0);
  for (let x = 0; x <= numFrames; x++) {
    let xx = map(x, 0, numFrames, 0, width);
    line(xx, ty + th, xx, ty + th2);
  }
  line(frameDim-1, ty + th, frameDim-1, ty + th2);

}
