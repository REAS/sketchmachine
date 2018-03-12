// POINTS

let pastPoints = [];
for (let i = 0; i < markers.length; i += 1) {
  pastPoints.push({
    lastPoint: {
      color: undefined,
      thickness: undefined,
      x: undefined,
      y: undefined,
    },
    lastPointFrames: []
  })
}

/*
function mark1(sketch, i, color, thickness) {

  thickness /= 4;

  // if (smoothing) {
  //   mx += (targetX - mx) * easing;
  //   my += (targetY - my) * easing;
  // }

  if (pmx !== mx || pmy !== my) {
    markerFrames[i].strokeCap(sketch.ROUND);
    markerFrames[i].noFill();
    markerFrames[i].stroke(color);
    if (speedSize) {
      let varThick = sketch.map(thickness, 1, 100, 0.25, 3.0);
      let diameter = sketch.dist(pmx, pmy, mx, my) * varThick;
      markerFrames[i].strokeWeight(diameter);
    } else {
      markerFrames[i].strokeWeight(thickness + 1);
    }

    let x1 = mx + rx;
    let y1 = my + ry;
    markerFrames[i].point(x1, y1);
  }
}
*/

function mark1(sketch, i, color, thickness) {

  thickness /= 4;

  /*
  if (smoothing) {
    mx += (targetX - mx) * easing;
    my += (targetY - my) * easing;
  }
  */

  markerFrames[i].strokeCap(sketch.ROUND);
  markerFrames[i].stroke(color);

  if (speedSize) {
    let varThick = sketch.map(thickness, 1, 100, 0.25, 2.0);
    let diameter = sketch.dist(pmx, pmy, mx, my) * varThick;
    markerFrames[i].strokeWeight(diameter);
  } else {
    markerFrames[i].strokeWeight(thickness);
  }

  let x = mx + rx;
  let y = my + ry;

  let lastPoint = pastPoints[i].lastPoint;
  let lastPointFrames = pastPoints[i].lastPointFrames;

  let pointChanged = lastPoint.color !== color ||
    lastPoint.thickness !== thickness ||
    lastPoint.x !== x ||
    lastPoint.y !== y;

  // markerFrames[i].drawingContext.globalCompositeOperation = 'copy';

  if (pointChanged) {
    markerFrames[i].point(x, y);
    pastPoints[i].lastPointFrames = [currentFrame]
  } else if (lastPointFrames.includes(currentFrame) === false) {
    lastPointFrames.push(currentFrame);
    markerFrames[i].point(x, y);
  }

  // markerFrames[i].drawingContext.globalCompositeOperation = 'source-over';

  pastPoints[i].lastPoint = {
    color: color,
    thickness: thickness,
    x: x,
    y: y,
  }
}


// LINES

let pastLines = [];
for (let i = 0; i < markers.length; i += 1) {
  pastLines.push({
    lastLine: {
      color: undefined,
      thickness: undefined,
      x1: undefined,
      y1: undefined,
      x2: undefined,
      y2: undefined
    },
    lastLineFrames: []
  })
}

function mark2(sketch, i, color, thickness) {

  /*
  if (smoothing) {
    mx += (targetX - mx) * easing;
    my += (targetY - my) * easing;
  }
  */

  markerFrames[i].strokeCap(sketch.ROUND);
  markerFrames[i].strokeJoin(sketch.ROUND);
  markerFrames[i].stroke(color);
  markerFrames[i].noFill();
  if (speedSize) {
    let varThick = sketch.map(thickness, 1, 100, 0.25, 2.0);
    let diameter = sketch.dist(pmx, pmy, mx, my) * varThick;
    markerFrames[i].strokeWeight(diameter);
  } else {
    markerFrames[i].strokeWeight(thickness);
  }

  let x0 = ppmx + pprx;
  let y0 = ppmy + ppry;
  let x1 = pmx + prx;
  let y1 = pmy + pry;
  let x2 = mx + rx;
  let y2 = my + ry;

  let lastLine = pastLines[i].lastLine;
  let lastLineFrames = pastLines[i].lastLineFrames;

  let lineChanged = lastLine.color !== color ||
    lastLine.thickness !== thickness ||
    lastLine.x1 !== x1 ||
    lastLine.y1 !== y1 ||
    lastLine.x2 !== x2 ||
    lastLine.y2 !== y2;

  let points

  if (lineChanged) {
    points = curvePoints(x0, y0, x1, y1, x2, y2);
    pastLines[i].lastLineFrames = [currentFrame];
  } else if (lastLineFrames.includes(currentFrame) === false) {
    lastLineFrames.push(currentFrame);
    points = curvePoints(x0, y0, x1, y1, x2, y2);
  }

  if (points) {
    if (points.length === 2 && points[0][0] === points[1][0] && points[0][1] === points[1][1]) {
      markerFrames[i].point(...points[0])
    } else if (points.length === 0) {
      markerFrames[i].point(x2, y2);
    } else {
      markerFrames[i].beginShape();
      points.forEach((p) => { markerFrames[i].vertex(...p); });
      markerFrames[i].endShape();
    }
  }

  pastLines[i].lastLine = {
    color: color,
    thickness: thickness,
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
  }
}

// QUADS

function mark3(sketch, i, color, thickness) {
  /*
  if (smoothing) {
    mx += (targetX - mx) * easing;
    my += (targetY - my) * easing;
  }
  */

  if (pmx !== mx || pmy !== my) {
    markerFrames[i].strokeCap(sketch.SQUARE);
    markerFrames[i].noFill();
    markerFrames[i].stroke(color);
    if (speedSize) {
      let varThick = sketch.map(thickness, 1, 100, 0.25, 3.0);
      let diameter = sketch.dist(pmx, pmy, mx, my) * varThick;
      markerFrames[i].strokeWeight(diameter);
    } else {
      markerFrames[i].strokeWeight(thickness + 1);
    }

    let x1 = pmx + prx;
    let y1 = pmy + pry;
    let x2 = mx + rx;
    let y2 = my + ry;
    markerFrames[i].line(x1, y1, x2, y2);
  }
}


// Utility functions for curves

function curvePoints(x0, y0, x1, y1, x2, y2) {
  // Update pastPast, past, and current points.
  let midp1 = midp([], [x0, y0], [x1, y1]);
  let midp2 = midp([], [x1, y1], [x2, y2]);

  let flow = 1;

  // Make a low res (flattened) quadratic bezier curve from three control points, so that a completely new curve is generated each time a mouse coordinate gets added.
  // A: Midpoint of past and pastPast points.
  // B: pastPoint
  // C: Midpoint of pastPoint and current point.
  let dist = Math.hypot(midp2[0] - midp1[0], midp2[1] - midp1[1]);
  let segmentCount = 1 + Math.floor(dist / flow);
  let step = 1 / segmentCount;
  let bezierPoints = [];
  for (let i = 0; i <= segmentCount; i += 1) {
    let t = i*step;
    bezierPoints.push(quadBez(t, midp1, [x1, y1], midp2));
  }

  return bezierPoints
}

function quadBez (t, p1, p2, p3) {
  return [quadBezXY(t, [p1[0], p2[0], p3[0]]), quadBezXY(t, [p1[1], p2[1], p3[1]])]
}

function quadBezXY(t, w) {
  t2 = t * t;
  mt = 1 - t;
  mt2 = mt * mt;
  return w[0] * mt2 + w[1] * 2 * mt * t + w[2] * t2
}

function midp (out, a, b) {
  out[0] = (a[0] + b[0]) / 2;
  out[1] = (a[1] + b[1]) / 2;
  return out
}
