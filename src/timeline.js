function timelineH() {

  let tw = width / numFrames;
  let ty = frameDim + 10;
  let th = 25;
  let th2 = th*2;

  let tx = map(currentFrame, 0, numFrames, 0, width);


  // Current frame
  fill(0);
  noStroke();
  rect(tx, ty, tw+1, th);

  // Frame(s) to draw into
  fill(0, 0, 255 );
  noStroke();
  rect(tx, ty+th, tw+1, th);

  //noStroke();
  //fill(0);
  //triangle(0, ty+20, tw, ty+30, 0, ty+30);

  // First to last Frame
  fill(102);
  rect((firstFrame * tw) + tw, ty + th2, (lastFrame-firstFrame)*tw - tw*2, th);
  triangle(firstFrame*tw, ty + th2 + th/2, firstFrame*tw + tw, ty + th2, firstFrame*tw + tw, ty + th2 + th);
  //triangle();

  //console.log("ugh.");

  // Tick marks
  stroke(0);
  for (let x = 0; x <= numFrames; x++) {
    let xx = map(x, 0, numFrames, 0, width);
    //line(0, yy, 30, yy);
    line(xx, ty+th, xx, ty+th2);
  }

}
