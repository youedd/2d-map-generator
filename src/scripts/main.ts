import p5 from "p5";


new p5((sketch: p5) => {

  let shader: p5.Shader;

  sketch.preload = () => {
    shader = sketch.loadShader("assets/map.vert", "assets/map.frag");
  };

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, "webgl");
    sketch.shader(shader);
  };

  sketch.windowResized = () => {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
  };
  sketch.draw = () => {
    console.log(sketch.frameRate())
    sketch.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  }
});
