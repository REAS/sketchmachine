function mark1(i) {
  b1Thickness = parseInt(b1Slider.value);
  frames[i].noFill();
  frames[i].stroke(255);
  frames[i].strokeWeight(b1Thickness);
  frames[i].line(pmx, pmy, mx, my);
}