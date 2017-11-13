/*
// LINES

function mark1(i, color, thickness) {
  frames[i].strokeCap(ROUND);
  frames[i].noFill();
  frames[i].stroke(color);
  frames[i].strokeWeight(thickness);
  frames[i].line(pmx, pmy, mx, my);
}

// QUADS
function mark2(i, color, thickness) {
  frames[i].strokeCap(SQUARE);
  frames[i].noFill();
  frames[i].stroke(color);
  frames[i].strokeWeight(thickness);
  frames[i].line(pmx, pmy, mx, my);
  //frames[i].ellipse(mx, my, 100, 100);
}
*/

// LINES
function mark1(i, color, thickness) {
  markerFrames[i].strokeCap(ROUND);
  markerFrames[i].noFill();
  markerFrames[i].stroke(color);
  markerFrames[i].strokeWeight(thickness);
  markerFrames[i].line(pmx, pmy, mx, my);
}

// QUADS
function mark2(i, color, thickness) {
  markerFrames[i].strokeCap(SQUARE);
  markerFrames[i].noFill();
  markerFrames[i].stroke(color);
  markerFrames[i].strokeWeight(thickness);
  markerFrames[i].line(pmx, pmy, mx, my);
  //frames[i].ellipse(mx, my, 100, 100);
}

