function mark1(i, color, thickness) {
  frames[i].noFill();
  frames[i].stroke(color);
  frames[i].strokeWeight(thickness);
  frames[i].line(pmx, pmy, mx, my);
}

function mark2(i, color, thickness) {
  frames[i].noFill();
  frames[i].stroke(255);
  frames[i].strokeWeight(thickness);
  frames[i].ellipse(mx, my, 100, 100);
}
