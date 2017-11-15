function openColorSelector() {
  colors.classList.add('active');
  colorActive = true;
  currentColorSelection = arguments[0];
}

function closeColorSelector() {
  if (currentColorSelection === 1) {
    marker1Color = currentColor;
    marker1ColorButton.style.backgroundColor = marker1Color;
  } else if (currentColorSelection === 2) {
    marker2Color = currentColor;
    marker2ColorButton.style.backgroundColor = marker2Color;
  } else if (currentColorSelection === 3) {
    marker3Color = currentColor;
    marker3ColorButton.style.backgroundColor = marker3Color;
  } else if (currentColorSelection === 4) {
    marker4Color = currentColor;
    marker4ColorButton.style.backgroundColor = marker4Color;
  } else if (currentColorSelection === 5) {
    marker5Color = currentColor;
    marker5ColorButton.style.backgroundColor = marker5Color;
  }
  colors.classList.remove('active');
  colorActive = false;
}

function clickPlay() {
  pause = !pause;
  if (pause) {
    document.getElementById("play").value = "play";
    document.getElementById("next").style.visibility = "visible";
    document.getElementById("back").style.visibility = "visible";
  } else {
    document.getElementById("play").value = "pause";
    document.getElementById("next").style.visibility = "hidden";
    document.getElementById("back").style.visibility = "hidden";
    if (playbackMode === ONCE && currentFrame === lastFrame-1) {
      currentFrame = firstFrame;
    }
    if (playbackMode === BACKANDFORTH && currentFrame === lastFrame-1) {
      playbackDirection = -1;
    }
  }
}

function clickBack() {
  currentFrame--;
  if (currentFrame < firstFrame) {
    currentFrame = lastFrame - 1;
  }
}

function clickNext() {
  currentFrame++;
  if (currentFrame >= lastFrame) {
    currentFrame = firstFrame;
  }
}

function clickOnce() {
  playbackMode = ONCE;
}

function clickLoop() {
  playbackMode = LOOP;
}

function clickBackAndForth() {
  playbackMode = BACKANDFORTH;
}

function componentToHex(c) {
  let hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

