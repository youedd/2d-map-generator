import p5 from "p5";

type Element = p5.Element & {
  input: (func: () => void) => void;
};

new p5((sketch: p5) => {
  let shader: p5.Shader;

  // INITIAL NOISE PARAMS
  const octaves = 7;
  const freq = 0.001;
  const persistence = 0.6;
  const offset = [0, 0];

  // INITIAL FILTER PARAMS
  const exp = 0.1;
  const radius = Math.min(sketch.windowHeight, sketch.windowWidth) - 40;

  // Steps
  const exp_dt = 0.01;
  const persistence_dt = 0.01;
  const freq_dt = 0.0001;
  const offset_dt = 0.01;
  const radius_dt = 10;

  // Helpers
  const initElement = (element: Element) => {
    element.input(handleParamsChange);
    if (panel) {
      element.parent(panel);
    }
  };

  const createInput = (value: number, step: number) => {
    const element = sketch.createInput(String(value), "number") as Element;
    const elt = element.elt as HTMLInputElement;
    elt.setAttribute("step", String(step));
    initElement(element);
    return element;
  };

  const createSlider = (...args: Parameters<typeof sketch.createSlider>) => {
    const element = sketch.createSlider(...args) as Element;
    initElement(element);
    return element;
  };

  const handleParamsChange = () => {
    sketch.draw();
  };

  // PANEL
  const panel = sketch.select("#panel");
  const octaves_slider = createSlider(1, 10, octaves, 1);
  const freq_input = createInput(freq, freq_dt);
  const persistence_input = createInput(persistence, persistence_dt);
  const offset_x_input = createInput(offset[0], offset_dt);
  const offset_y_input = createInput(offset[1], offset_dt);

  const exp_input = createInput(exp, exp_dt);
  const radius_input = createInput(radius, radius_dt);

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

    shader.setUniform("exp", Number(exp_input.value()));
    shader.setUniform("radius", Number(radius_input.value()));

    shader.setUniform("octaves", Number(octaves_slider.value()));
    shader.setUniform("freq", Number(freq_input.value()));
    shader.setUniform("persistence", Number(persistence_input.value()));
    shader.setUniform("offset", [
      Number(offset_x_input.value()),
      Number(offset_y_input.value()),
    ]);

    sketch.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  };

  // sketch.mouseWheel = ({ deltaY }: { deltaY: number }) => {
  //   exp += deltaY > 0 ? exp_dt : -exp_dt;
  //   exp = sketch.constrain(exp, 0, 5);
  //   sketch.draw();
  // };

  // document.onkeydown = () => {
  //   switch (sketch.keyCode) {
  //     case sketch.LEFT_ARROW:
  //       offset[0] += offset_dt;
  //       break;
  //     case sketch.RIGHT_ARROW:
  //       offset[0] -= offset_dt;
  //       break;
  //     case sketch.UP_ARROW:
  //       offset[1] -= offset_dt;
  //       break;
  //     case sketch.DOWN_ARROW:
  //       offset[1] += offset_dt;
  //       break;
  //   }
  //   sketch.draw();
  // };
});
