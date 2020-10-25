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

  // PANEL
  let panel: p5.Element | null;
  let octaves_slider: Element;
  let freq_input: Element;
  let persistence_input: Element;
  let offset_x_input: Element;
  let offset_y_input: Element;
  let exp_input: Element;
  let radius_input: Element;

  sketch.preload = () => {
    shader = sketch.loadShader("assets/map.vert", "assets/map.frag");
  };

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, "webgl");
    sketch.shader(shader);
    sketch.noLoop();

    panel = sketch.select("#panel");

    if (!panel) {
      throw "Panel element not found";
    }

    const closeButton = sketch.select("#close");
    closeButton?.mouseClicked(() => {
      panel?.toggleClass("opened");
    });

    const noiseBlock = createBlock(panel, "noise :");
    octaves_slider = createSlider("octaves", noiseBlock, 1, 10, octaves, 1);
    freq_input = createInput("frequence", noiseBlock, freq, freq_dt);
    persistence_input = createInput(
      "persistence",
      noiseBlock,
      persistence,
      persistence_dt
    );
    offset_x_input = createInput("x offset", noiseBlock, offset[0], offset_dt);
    offset_y_input = createInput("y offset", noiseBlock, offset[1], offset_dt);

    const filterBlock = createBlock(panel, "filter :");
    exp_input = createInput("exponent", filterBlock, exp, exp_dt);
    radius_input = createInput("radius", filterBlock, radius, radius_dt);
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

  // Dom Helpers
  const createBlock = (parent: p5.Element, title: string) => {
    const container = sketch.createDiv();
    container.addClass("block");

    const label = sketch.createElement("label");
    label.html(title);

    label.parent(container);
    container.parent(parent);

    return container;
  };

  const createInput = (
    title: string,
    parent: p5.Element,
    value: number,
    step: number
  ) => {
    const container = sketch.createDiv();
    container.addClass("param");

    const label = sketch.createElement("label");
    label.html(title);

    const element = sketch.createInput(String(value), "number") as Element;
    const elt = element.elt as HTMLInputElement;
    elt.setAttribute("step", String(step));

    label.parent(container);
    element.parent(container);

    element.input(() => {
      sketch.draw();
    });

    container.parent(parent);

    return element;
  };

  const createSlider = (
    title: string,
    parent: p5.Element,
    min: number,
    max: number,
    value: number,
    step: number
  ) => {
    const container = sketch.createDiv();
    container.addClass("param");

    const label = sketch.createElement("label");
    label.html(title);

    const span = sketch.createSpan();
    span.html(String(value));

    const element = sketch.createSlider(min, max, value, step) as Element;
    element.input(() => {
      sketch.draw();
      span.html(String(element.value()));
    });

    label.parent(container);
    element.parent(container);
    span.parent(container);

    container.parent(parent);

    return element;
  };
});
