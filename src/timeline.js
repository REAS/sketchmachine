function timelineH() {

  var tw = width / numFrames;
  stroke(0);
  for (var x = 0; x <= numFrames; x++) {
  	var xx = map(x, 0, numFrames, 0, width);
  	//line(0, yy, 30, yy);
  	line(xx, 512+10, xx, 512+19);
  }

  var tx = map(cf, 0, numFrames, 0, width);
  fill(0);
  noStroke();
  rect(tx, 512+5, tw+1, 5);


  //console.log("ugh.");

}

function timeline() {

  var th = height / numFrames;

  stroke(204);
  for (var y = 0; y <= numFrames; y++) {
  	var yy = map(y, 0, numFrames, 0, height);
  	line(0, yy, 30, yy);
  }

  var ty = map(cf, 0, numFrames, 0, height);
  fill(0);
  noStroke();
  rect(15, ty, 15, th);

  var tty = map(cf, 0, numFrames, 0, height);
  fill(102);
  noStroke();
  rect(0, tty, 15, th);

}