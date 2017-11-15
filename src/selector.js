// COLOR SELECTOR
let colorSelectorCanvas = function (p) {
  //var gray = 0;

  let img;

  p.preload = function () {
    img = p.loadImage("colors.gif");
  }

  p.setup = function () {
    p.createCanvas(512, 512);
  };

  p.draw = function () {
    p.background("#FFFFFF");
    p.image(img, 0, 0);
  };

  p.mousePressed = function () {
    //currentColor = "#FF00FF";
    if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
      //currentColor = "#FF00FF"; //p.get(p.mouseX, p.mouseY);
      let cc = p.get(p.mouseX, p.mouseY);
      currentColor = rgbToHex(cc[0], cc[1], cc[2]);
      closeColorSelector();
      //console.log(currentColor);
    }
  };
};

new p5(colorSelectorCanvas, colorSelector);


// BACKGROUND COLOR SELECTOR
let backgroundColorSelectorCanvas = function (p) {
  //var gray = 0;

  let img;

  p.preload = function () {
    img = p.loadImage("colors.gif");
  }

  p.setup = function () {
    p.createCanvas(512, 512);
  };

  p.draw = function () {
    p.background("#FFFFFF");
    p.image(img, 0, 0);
  };

  p.mousePressed = function () {
    //currentColor = "#FF00FF";
    if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
      //currentColor = "#FF00FF"; //p.get(p.mouseX, p.mouseY);
      let cc = p.get(p.mouseX, p.mouseY);
      currentColor = rgbToHex(cc[0], cc[1], cc[2]);
      closeBackgroundColorSelector();
      console.log(currentColor);
    }
  };
};

new p5(backgroundColorSelectorCanvas, backgroundColorSelector);