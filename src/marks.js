// POINTS
let pastPoints = []
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

function mark1(sketch, i, color, thickness) {
  if (smoothing) {
    mx += (targetX - mx) * easing;
    my += (targetY - my) * easing;
  }

  markerFrames[i].strokeCap(sketch.ROUND);
  markerFrames[i].stroke(color);

  if (speedSize) {
    let varThick = sketch.map(thickness, 1, 100, 0.25, 2.0);
    let diameter = sketch.dist(pmx, pmy, mx, my) * varThick;
    markerFrames[i].strokeWeight(diameter);
  } else {
    markerFrames[i].strokeWeight(thickness);
  }

  let x = mx + rx
  let y = my + ry

  let lastPoint = pastPoints[i].lastPoint
  let lastPointFrames = pastPoints[i].lastPointFrames

  let pointChanged = lastPoint.color !== color ||
    lastPoint.thickness !== thickness ||
    lastPoint.x !== x ||
    lastPoint.y !== y;

  markerFrames[i].drawingContext.globalCompositeOperation = 'copy'

  if (pointChanged) {
    markerFrames[i].point(x, y);
    pastPoints[i].lastPointFrames = [currentFrame]
  } else if (lastPointFrames.includes(currentFrame) === false) {
    lastPointFrames.push(currentFrame)
    markerFrames[i].point(x, y);
  }

  markerFrames[i].drawingContext.globalCompositeOperation = 'source-over'

  pastPoints[i].lastPoint = {
    color: color,
    thickness: thickness,
    x: x,
    y: y,
  }

}

// LINES
let pastLines = []
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
  if (smoothing) {
    mx += (targetX - mx) * easing;
    my += (targetY - my) * easing;
  }
  markerFrames[i].strokeCap(sketch.ROUND);
  markerFrames[i].stroke(color);
  if (speedSize) {
    let varThick = sketch.map(thickness, 1, 100, 0.25, 2.0);
    let diameter = sketch.dist(pmx, pmy, mx, my) * varThick;
    markerFrames[i].strokeWeight(diameter);
  } else {
    markerFrames[i].strokeWeight(thickness);
  }

  let x1 = pmx + prx
  let y1 = pmy + pry
  let x2 = mx + rx
  let y2 = my + ry

  let lastLine = pastLines[i].lastLine
  let lastLineFrames = pastLines[i].lastLineFrames

  let lineChanged = lastLine.color !== color ||
    lastLine.thickness !== thickness ||
    lastLine.x1 !== x1 ||
    lastLine.y1 !== y1 ||
    lastLine.x2 !== x2 ||
    lastLine.y2 !== y2;

  if (lineChanged) {
    markerFrames[i].line(x1, y1, x2, y2);
    pastLines[i].lastLineFrames = [currentFrame]
  } else if (lastLineFrames.includes(currentFrame) === false) {
    lastLineFrames.push(currentFrame)
    markerFrames[i].line(x1, y1, x2, y2);
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
  if (smoothing) {
    mx += (targetX - mx) * easing;
    my += (targetY - my) * easing;
  }

  if (pmx !== mx || pmy !== my) {
    markerFrames[i].strokeCap(sketch.SQUARE);
    markerFrames[i].noFill();
    markerFrames[i].stroke(color);
    if (speedSize) {
      let varThick = sketch.map(thickness, 1, 100, 0.25, 3.0);
      let diameter = sketch.dist(pmx, pmy, mx, my) * varThick;
      markerFrames[i].strokeWeight(diameter);
    } else {
      markerFrames[i].strokeWeight(thickness + 5);
    }

    let x1 = pmx + prx
    let y1 = pmy + pry
    let x2 = mx + rx
    let y2 = my + ry
    markerFrames[i].line(x1, y1, x2, y2);
  }
}
