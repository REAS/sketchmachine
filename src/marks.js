// POINTS
function mark1(i, color, thickness) {
  /*
  markerFrames[i].strokeCap(ROUND);
  markerFrames[i].noFill();
  markerFrames[i].stroke(color);
  markerFrames[i].strokeWeight(thickness);
  markerFrames[i].point(mx + rx, my + ry);
  */

  markerFrames[i].strokeCap(ROUND);
  markerFrames[i].stroke(color);

  /*
  markerFrames[i].noStroke();
  markerFrames[i].fill(color);
  let varThick = map(thickness, 1, 100, 0.25, 2.0);
  let diameter = dist(pmx, pmy, mx, my) * varThick;
  markerFrames[i].ellipse(mx + rx, my + ry, diameter, diameter);
  */

  if (speedSize) {
    let varThick = map(thickness, 1, 100, 0.25, 2.0);
    let diameter = dist(pmx, pmy, mx, my) * varThick;
    markerFrames[i].strokeWeight(diameter);
  } else {
    markerFrames[i].strokeWeight(thickness);
  }

  markerFrames[i].point(mx + rx, my + ry);

}

// LINES
function mark2(i, color, thickness) {
  /*
  markerFrames[i].strokeCap(ROUND);
  markerFrames[i].noFill();
  markerFrames[i].stroke(color);
  markerFrames[i].strokeWeight(thickness);
  markerFrames[i].line(pmx, pmy, mx + rx, my + ry);
  */

  markerFrames[i].strokeCap(ROUND);
  markerFrames[i].stroke(color);
  if (speedSize) {
    let varThick = map(thickness, 1, 100, 0.25, 2.0);
    let diameter = dist(pmx, pmy, mx, my) * varThick;
    markerFrames[i].strokeWeight(diameter);
  } else {
    markerFrames[i].strokeWeight(thickness);
  }
  markerFrames[i].line(pmx, pmy, mx + rx, my + ry);
}

// QUADS
function mark3(i, color, thickness) {
  if (pmx !== mx || pmy !== my) {
    markerFrames[i].strokeCap(SQUARE);
    markerFrames[i].noFill();
    markerFrames[i].stroke(color);
    if (speedSize) {
      let varThick = map(thickness, 1, 100, 0.25, 3.0);
      let diameter = dist(pmx, pmy, mx, my) * varThick;
      markerFrames[i].strokeWeight(diameter);
    } else {
      markerFrames[i].strokeWeight(thickness + 5);
    }
    markerFrames[i].line(pmx, pmy, mx + rx, my + ry);
  }
}

// VARIABLE-SIZE LINES / RETIRED
function mark4(i, color, thickness) {
  /*
  markerFrames[i].strokeCap(ROUND);
  markerFrames[i].stroke(color);
  let varThick = map(thickness, 1, 100, 0.25, 2.0);
  let diameter = dist(pmx, pmy, mx, my) * varThick;
  markerFrames[i].strokeWeight(diameter);
  markerFrames[i].line(pmx, pmy, mx + rx, my + ry);
  */
}

// VARIABLE-SIZE CIRCLES / RETIRED
function mark5(i, color, thickness) {
  /*
  markerFrames[i].noStroke();
  markerFrames[i].fill(color);
  let varThick = map(thickness, 1, 100, 0.25, 2.0);
  let diameter = dist(pmx, pmy, mx, my) * varThick;
  markerFrames[i].ellipse(mx + rx, my + ry, diameter, diameter);
  */
}

