type CanvasContext = CanvasRenderingContext2D & {
  running?: boolean;
  frame?: number;
};

interface OscillatorOptions {
  phase?: number;
  offset?: number;
  frequency?: number;
  amplitude?: number;
}

class Oscillator {
  phase: number;
  offset: number;
  frequency: number;
  amplitude: number;
  currentValue: number;

  constructor(options: OscillatorOptions = {}) {
    this.phase = options.phase ?? 0;
    this.offset = options.offset ?? 0;
    this.frequency = options.frequency ?? 0.001;
    this.amplitude = options.amplitude ?? 1;
    this.currentValue = 0;
  }

  update(): number {
    this.phase += this.frequency;
    this.currentValue = this.offset + Math.sin(this.phase) * this.amplitude;
    return this.currentValue;
  }

  value(): number {
    return this.currentValue;
  }
}

class Node {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
}

const CONFIG = {
  friction: 0.5,
  trails: 80,
  size: 50,
  dampening: 0.025,
  tension: 0.99,
};

class Line {
  spring: number;
  friction: number;
  nodes: Node[];

  constructor(spring: number) {
    this.spring = spring + 0.1 * Math.random() - 0.05;
    this.friction = CONFIG.friction + 0.01 * Math.random() - 0.005;
    this.nodes = [];
    for (let i = 0; i < CONFIG.size; i++) {
      const node = new Node();
      node.x = pos.x;
      node.y = pos.y;
      this.nodes.push(node);
    }
  }

  update() {
    let spring = this.spring;
    let node = this.nodes[0];
    node.vx += (pos.x - node.x) * spring;
    node.vy += (pos.y - node.y) * spring;

    for (let i = 0; i < this.nodes.length; i++) {
      node = this.nodes[i];
      if (i > 0) {
        const prev = this.nodes[i - 1];
        node.vx += (prev.x - node.x) * spring;
        node.vy += (prev.y - node.y) * spring;
        node.vx += prev.vx * CONFIG.dampening;
        node.vy += prev.vy * CONFIG.dampening;
      }
      node.vx *= this.friction;
      node.vy *= this.friction;
      node.x += node.vx;
      node.y += node.vy;
      spring *= CONFIG.tension;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    let n = this.nodes[0].x;
    let i = this.nodes[0].y;
    ctx.beginPath();
    ctx.moveTo(n, i);
    const len = this.nodes.length - 2;
    let a = 1;
    for (; a < len; a++) {
      const e = this.nodes[a];
      const t = this.nodes[a + 1];
      n = 0.5 * (e.x + t.x);
      i = 0.5 * (e.y + t.y);
      ctx.quadraticCurveTo(e.x, e.y, n, i);
    }
    const e = this.nodes[a];
    const t = this.nodes[a + 1];
    ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);
    ctx.stroke();
    ctx.closePath();
  }
}

let ctx: CanvasContext | null = null;
let lines: Line[] = [];
let animationId: number | null = null;
const pos = { x: 0, y: 0 };
let removePosListeners: (() => void) | null = null;

function initLines() {
  lines = [];
  for (let i = 0; i < CONFIG.trails; i++) {
    lines.push(new Line(0.45 + (i / CONFIG.trails) * 0.025));
  }
}

function onMousemove(
  e: MouseEvent | TouchEvent,
  triggerCleanup: () => void
) {
  const setPos = (ev: MouseEvent | TouchEvent) => {
    if ("touches" in ev) {
      pos.x = ev.touches[0].pageX;
      pos.y = ev.touches[0].pageY;
    } else {
      pos.x = (ev as MouseEvent).clientX;
      pos.y = (ev as MouseEvent).clientY;
    }
    ev.preventDefault();
  };

  const onTouchStart = (ev: TouchEvent) => {
    if (ev.touches.length === 1) {
      pos.x = ev.touches[0].pageX;
      pos.y = ev.touches[0].pageY;
    }
  };

  triggerCleanup();
  document.addEventListener("mousemove", setPos as EventListener);
  document.addEventListener("touchmove", setPos as EventListener, {
    passive: false,
  });
  document.addEventListener("touchstart", onTouchStart);

  removePosListeners = () => {
    document.removeEventListener("mousemove", setPos as EventListener);
    document.removeEventListener("touchmove", setPos as EventListener);
    document.removeEventListener("touchstart", onTouchStart);
  };

  setPos(e);
  initLines();
  render();
}

function render() {
  if (!ctx?.canvas || !ctx.running) return;

  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = `hsla(${Math.round(oscillator.update())},100%,50%,0.025)`;
  ctx.lineWidth = 10;

  for (let t = 0; t < CONFIG.trails; t++) {
    const line = lines[t];
    if (line) {
      line.update();
      line.draw(ctx);
    }
  }

  ctx.frame = (ctx.frame ?? 0) + 1;
  animationId = window.requestAnimationFrame(render);
}

function resizeCanvas() {
  if (!ctx?.canvas) return;
  ctx.canvas.width = window.innerWidth - 20;
  ctx.canvas.height = window.innerHeight;
}

let oscillator: Oscillator;

export function renderCanvas(): (() => void) | void {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
  if (!canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  ctx = context as CanvasContext;
  ctx.running = true;
  ctx.frame = 1;

  oscillator = new Oscillator({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285,
  });

  const handleMousemove = (e: MouseEvent) =>
    onMousemove(e, removeTriggerListeners);
  const handleTouchStart = (e: TouchEvent) =>
    onMousemove(e, removeTriggerListeners);

  function removeTriggerListeners() {
    document.removeEventListener("mousemove", handleMousemove);
    document.removeEventListener("touchstart", handleTouchStart);
  }

  document.addEventListener("mousemove", handleMousemove);
  document.addEventListener("touchstart", handleTouchStart);
  document.body.addEventListener("orientationchange", resizeCanvas);
  window.addEventListener("resize", resizeCanvas);

  const onFocus = () => {
    if (ctx && !ctx.running) {
      ctx.running = true;
      render();
    }
  };
  const onBlur = () => {
    if (ctx) ctx.running = true;
  };
  window.addEventListener("focus", onFocus);
  window.addEventListener("blur", onBlur);

  resizeCanvas();

  return () => {
    const c = ctx;
    if (c) c.running = false;
    if (animationId != null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    removeTriggerListeners();
    removePosListeners?.();
    document.body.removeEventListener("orientationchange", resizeCanvas);
    window.removeEventListener("resize", resizeCanvas);
    window.removeEventListener("focus", onFocus);
    window.removeEventListener("blur", onBlur);
    ctx = null;
  };
}
