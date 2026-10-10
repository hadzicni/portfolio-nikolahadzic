/**
 * A canvas of code glyphs that settle into the shape of a word.
 *
 * Every particle remembers a home point sampled from the word, springs back to
 * it, and runs from the pointer. Swapping the word gives the particles new
 * homes, so they fly across the canvas to form it. The canvas is purely
 * decorative: whatever uses it keeps the real text in the DOM.
 */

const GLYPHS = '!<>-_\\/[]{}=+*^?#01';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hx: number;
  hy: number;
  /** Direction the particle leaves in when the field scatters. */
  sx: number;
  sy: number;
  glyph: string;
};

export type GlyphLayout = {
  fontWeight: string;
  fontSize: number;
  fontFamily: string;
  /** In pixels. Canvas text ignores the CSS letter-spacing otherwise. */
  letterSpacing: number;
  /** The face the glyphs themselves are drawn in, as a CSS `font`. */
  glyphFont: string;
  /** Distance between sampled points: smaller means more particles. */
  step: number;
  /** Gap between the canvas edge and the text, for glyphs that fly out. */
  pad: number;
};

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Reads the type of a rendered element, so the glyphs land where its text sits. */
export function layoutFor(element: HTMLElement): GlyphLayout {
  const style = getComputedStyle(element);
  const size = parseFloat(style.fontSize);
  const mono =
    getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim() || 'monospace';

  return {
    fontWeight: style.fontWeight,
    fontSize: size,
    fontFamily: style.fontFamily,
    letterSpacing: parseFloat(style.letterSpacing) || 0,
    // Both scale with the text, so small titles get finer glyphs on a denser
    // grid instead of clumping into an unreadable blur.
    glyphFont: `400 ${Math.max(4, Math.round(size / 8.5))}px ${mono}`,
    step: Math.max(2, Math.round(size / 16)),
    pad: Math.round(size * 0.6),
  };
}

/** The colours the glyphs are drawn in, read from the current theme. */
export function themeColors(element: HTMLElement) {
  return {
    ink: getComputedStyle(element).color,
    accent:
      getComputedStyle(document.documentElement).getPropertyValue('--acid').trim() || '#59d483',
  };
}

export class GlyphField {
  /** 0 keeps every glyph home, 1 throws them all out of the canvas. */
  scatter = 0;
  pointer = { x: -1e4, y: -1e4 };
  colors = { ink: '#fff', accent: '#59d483' };

  private particles: Particle[] = [];
  private ctx: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;
  private layout: GlyphLayout | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
  }

  /** Sizes the canvas to its box, at the screen's pixel density. */
  resize(layout: GlyphLayout) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.layout = layout;
  }

  /**
   * Gives the particles `text` as their new home. New particles start
   * anywhere on the canvas, or close to their home with `spawn: 'near'`;
   * `burst` kicks the existing ones outwards first.
   */
  form(text: string, { burst = false, spawn = 'anywhere' }: { burst?: boolean; spawn?: 'anywhere' | 'near' } = {}) {
    const points = this.sample(text);
    const spread = (this.layout?.pad ?? 40) * 3;

    points.forEach(([hx, hy], i) => {
      let particle = this.particles[i];

      if (!particle) {
        const angle = Math.random() * Math.PI * 2;
        particle = this.particles[i] = {
          x: spawn === 'near' ? hx + (Math.random() - 0.5) * spread * 2 : Math.random() * this.width,
          y: spawn === 'near' ? hy + (Math.random() - 0.5) * spread : Math.random() * this.height,
          vx: 0,
          vy: 0,
          hx,
          hy,
          sx: Math.cos(angle) * (0.5 + Math.random()),
          sy: Math.sin(angle) * (0.5 + Math.random()),
          glyph: randomGlyph(),
        };
      }

      particle.hx = hx;
      particle.hy = hy;

      if (burst) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 12;
        particle.vx += Math.cos(angle) * speed;
        particle.vy += Math.sin(angle) * speed;
      }
    });

    this.particles.length = points.length;
  }

  /** Advances one frame and draws it. Returns the mean distance from home. */
  tick() {
    const { ctx, layout } = this;
    if (!layout) return 0;

    const radius = layout.pad * 1.6;
    // Squared, so the first bit of scatter only loosens the word.
    const offset = this.scatter ** 2 * Math.max(this.width, 320) * 0.5;
    let drift = 0;

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.globalAlpha = 1 - this.scatter;
    ctx.font = layout.glyphFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const p of this.particles) {
      let ax = (p.hx - p.x) * 0.018;
      let ay = (p.hy - p.y) * 0.018;

      const dx = p.x - this.pointer.x;
      const dy = p.y - this.pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance < radius) {
        const force = ((radius - distance) / radius) * 2.8;
        ax += (dx / (distance || 1)) * force;
        ay += (dy / (distance || 1)) * force;
      }

      p.vx = (p.vx + ax) * 0.86;
      p.vy = (p.vy + ay) * 0.86;
      p.x += p.vx;
      p.y += p.vy;

      if (Math.random() < 0.02) p.glyph = randomGlyph();

      const away = Math.abs(p.hx - p.x) + Math.abs(p.hy - p.y);
      drift += away;

      ctx.fillStyle = away > 6 ? this.colors.accent : this.colors.ink;
      ctx.fillText(p.glyph, p.x + p.sx * offset, p.y + p.sy * offset);
    }

    ctx.globalAlpha = 1;
    return this.particles.length ? drift / this.particles.length : 0;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /** The points `text` covers, shuffled so a new word pulls glyphs across. */
  private sample(text: string): [number, number][] {
    const layout = this.layout;
    if (!layout || !this.width || !this.height) return [];

    const scratch = document.createElement('canvas');
    scratch.width = Math.ceil(this.width);
    scratch.height = Math.ceil(this.height);
    const ctx = scratch.getContext('2d', { willReadFrequently: true })!;

    // A morph target can be longer than the word the canvas was sized for,
    // so anything too wide is set smaller until it fits.
    let size = layout.fontSize;
    const setFont = () => {
      ctx.font = `${layout.fontWeight} ${size}px ${layout.fontFamily}`;
      ctx.letterSpacing = `${(layout.letterSpacing * size) / layout.fontSize}px`;
    };
    setFont();
    while (ctx.measureText(text).width > this.width - layout.pad * 2 && size > 12) {
      size -= 2;
      setFont();
    }

    ctx.textBaseline = 'middle';
    ctx.fillText(text, layout.pad, this.height / 2);

    const { data } = ctx.getImageData(0, 0, scratch.width, scratch.height);
    const points: [number, number][] = [];
    for (let y = 0; y < scratch.height; y += layout.step) {
      for (let x = 0; x < scratch.width; x += layout.step) {
        if (data[(y * scratch.width + x) * 4 + 3] > 140) points.push([x, y]);
      }
    }

    for (let i = points.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [points[i], points[j]] = [points[j], points[i]];
    }

    return points;
  }
}
