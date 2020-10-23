import p5 from "p5";

new p5((sketch: p5) => {
  let shader: p5.Shader;
  let scale = 400;
  const offset = [0, 0];

  sketch.preload = () => {
    shader = sketch.loadShader("assets/map.vert", "assets/map.frag");
  };

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, "webgl");
    sketch.shader(shader);
    sketch.noLoop();
  };

  sketch.windowResized = () => {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
  };
  sketch.draw = () => {
    shader.setUniform("scale", scale);
    shader.setUniform("offset", offset);
    sketch.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    console.log(sketch.frameRate());
  };

  // sketch.mouseWheel = ({
  //   deltaX,
  //   deltaY,
  // }: {
  //   deltaX: number;
  //   deltaY: number;
  // }) => {
  //   let dt = 2;
  //   offset[0] += deltaX > 0 ? dt : -dt;
  //   offset[1] += deltaY > 0 ? dt : -dt;
  //   sketch.draw();
  // };
});
