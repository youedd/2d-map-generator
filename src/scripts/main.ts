import p5 from "p5";

new p5((sketch: p5) => {
  let shader: p5.Shader;
  let freq = 0.001;
  let exp = 0.1;
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
    shader.setUniform("u_resolution", [2 * sketch.width, 2 * sketch.height]);
    shader.setUniform("freq", freq);
    shader.setUniform("exp", exp);
    shader.setUniform("offset", offset);
    sketch.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  };

  sketch.mouseWheel = ({ delta }: { delta: number }) => {
    let dt = 0.01;
    exp += delta > 0 ? dt : -dt;
    exp = sketch.constrain(exp, 0, 5);
    sketch.draw();
  };

  document.onkeydown = () => {
    let dt = 0.01;

    switch (sketch.keyCode) {
      case sketch.LEFT_ARROW:
        offset[0] += dt;
        break;
      case sketch.RIGHT_ARROW:
        offset[0] -= dt;
        break;
      case sketch.UP_ARROW:
        offset[1] -= dt;
        break;
      case sketch.DOWN_ARROW:
        offset[1] += dt;
        break;
    }
    sketch.draw();
  };
});
