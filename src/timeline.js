function timelineH() {

  let tw = width / numFrames;
  let ty = frameDim + 10;

  let tx = map(cf, 0, numFrames, 0, width);
  fill(0);
  noStroke();
  rect(tx, ty+5, tw+1, 5);

  fill(0);
  noStroke();
  rect(tx, ty+5, tw+1, 5);


  //noStroke();
  //fill(0);
  //triangle(0, ty+20, tw, ty+30, 0, ty+30);

  fill(102);
  rect(firstFrame * tw, ty + 20, (lastFrame-firstFrame)*tw, 10);

  //console.log("ugh.");

  // Tick marks
  stroke(0);
  for (let x = 0; x <= numFrames; x++) {
    let xx = map(x, 0, numFrames, 0, width);
    //line(0, yy, 30, yy);
    line(xx, ty+10, xx, ty+19);
  }

}
