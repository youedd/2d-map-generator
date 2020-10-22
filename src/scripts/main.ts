import p5 from "p5";

new p5((sketch: p5) => {
  let map: p5.Color[][] = [];
  const noiseScale = 1 / 150;

  const shore = sketch.color("#008dc4");
  const ocean = sketch.color("#00a9cc");
  const sand = sketch.color("#eecda3");
  const grass = sketch.color("#7ec850");
  const stone = sketch.color("#572700");
  const snow = sketch.color("#fffafa");

  function makeMap() {
    map = [];
    for (let i = 0; i < sketch.width; i++) {
      map[i] = [];
      for (let j = 0; j < sketch.height; j++) {
        map[i][j] = pickColor(i, j);
      }
    }
  }

  const pickColor = (i: number, j: number) => {
    let h = sketch.noise(i * noiseScale, j * noiseScale);

    let c = sketch.color("black");

    if (h < 0.2) {
    //   c = sketch.lerpColor(ocean, shore, h / 0.2);
      return ocean
    } else if (h < 0.4) {
    //   c = sketch.lerpColor(shore, sand, (h - 0.2) / 0.2);
      return shore
    } else if (h < 0.6) {
    //   c = sketch.lerpColor(sand, grass, (h - 0.4) / 0.2);
      return sand
    } else if (h < 0.8) {
    //   c = sketch.lerpColor(grass, stone, (h - 0.6) / 0.2);
      return stone
    } else {
    //   c = sketch.lerpColor(stone, snow, (h - 0.8) / 0.2);
      return snow
    }

    return c;
  };

  sketch.draw = () => {
    console.log(sketch.frameRate());
    makeMap();
    for (let i = 0; i < sketch.width; i++) {
      for (let j = 0; j < sketch.height; j++) {
        sketch.set(i, j, map[i][j]);
      }
    }

    sketch.updatePixels();
  };

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);

    sketch.noiseSeed(50);

    sketch.noStroke();

    sketch.background(0);

    // sketch.noLoop();
  };

  sketch.windowResized = () => {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
  };
});
