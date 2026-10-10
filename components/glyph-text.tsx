'use client';

import * as React from 'react';

import { BOOT_DONE_EVENT, bootPending } from '@/components/boot-screen';
import { GlyphField, layoutFor, prefersReducedMotion, themeColors } from '@/lib/glyph-field';

/** How long a morphed word stays before the hero name comes back. */
const RETURN_AFTER = 4000;
const NO_WORDS: readonly string[] = [];

/**
 * The canvas sits over the text and reaches past it on every side so
 * scattered glyphs are not clipped — on the right only as far as the page
 * allows, or a phone would get a horizontal scrollbar.
 *
 * A canvas is a replaced element and keeps its intrinsic 300×150 under
 * `inset` alone, so the size is spelled out.
 */
function placeCanvas(canvas: HTMLCanvasElement, wrap: HTMLElement, pad: number) {
  const room = document.documentElement.clientWidth - wrap.getBoundingClientRect().right - 4;
  const right = Math.max(0, Math.min(pad, room));

  canvas.style.left = `-${pad}px`;
  canvas.style.top = `-${pad}px`;
  canvas.style.width = `calc(100% + ${pad + right}px)`;
  canvas.style.height = `calc(100% + ${pad * 2}px)`;
}

/**
 * Text drawn permanently in code glyphs that run from the pointer.
 *
 * The hero version starts after the boot sequence, cycles through `words` on a
 * click and scatters as the page scrolls away. A title assembles the first
 * time it comes into view and bursts and re-forms on a click.
 *
 * The real text stays in the DOM, only made transparent, so screen readers and
 * search engines read it. Without JavaScript or with reduced motion it is all
 * there is.
 */
function Glyphs({
  text,
  words = NO_WORDS,
  hero = false,
  className,
}: {
  text: string;
  words?: readonly string[];
  hero?: boolean;
  className?: string;
}) {
  const wrapRef = React.useRef<HTMLSpanElement>(null);
  const textRef = React.useRef<HTMLSpanElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const label = textRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !label || !canvas || prefersReducedMotion()) return;

    const field = new GlyphField(canvas);
    const cycle = [text, ...words];
    let index = 0;
    let frame = 0;
    let visible = false;
    let started = false;
    let cancelled = false;
    let returnTimer: ReturnType<typeof setTimeout> | undefined;

    // Draws only while on screen; the loop stops by itself when it is not.
    const draw = () => {
      field.tick();
      frame = visible ? requestAnimationFrame(draw) : 0;
    };
    const wake = () => {
      if (started && visible && !frame) frame = requestAnimationFrame(draw);
    };

    const layout = () => {
      const type = layoutFor(label);
      placeCanvas(canvas, wrap, type.pad);
      field.resize(type);
      field.colors = themeColors(wrap);
      field.form(cycle[index], { spawn: hero ? 'anywhere' : 'near' });
    };

    const show = (next: number) => {
      index = next;
      field.form(cycle[index], { burst: true });
      clearTimeout(returnTimer);
      if (index !== 0) returnTimer = setTimeout(() => show(0), RETURN_AFTER);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!visible) return;
      const rect = canvas.getBoundingClientRect();
      field.pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const onPointerEnd = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') field.pointer = { x: -1e4, y: -1e4 };
    };
    const onClick = () => show(cycle.length > 1 ? (index + 1) % cycle.length : 0);
    // The hero name holds still for the first stretch of scrolling, then comes
    // apart over the next half screen.
    const onScroll = () => {
      const height = window.innerHeight;
      field.scatter = Math.min(1, Math.max(0, (window.scrollY - height * 0.08) / (height * 0.55)));
    };

    const resizeObserver = new ResizeObserver(() => {
      if (started) layout();
    });
    const themeObserver = new MutationObserver(() => {
      field.colors = themeColors(wrap);
    });

    const start = async () => {
      if (started) return;
      started = true;
      await document.fonts.ready;
      if (cancelled) return;

      wrap.dataset.glyphs = 'live';
      layout();
      if (hero) {
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
      }
      resizeObserver.observe(wrap);
      themeObserver.observe(document.documentElement, { attributeFilter: ['class'] });
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerup', onPointerEnd, { passive: true });
      wrap.addEventListener('click', onClick);
      wake();
    };

    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        // A title waits for its first appearance to assemble.
        if (visible && !hero) start();
        wake();
      },
      { rootMargin: hero ? '200px 0px' : '0px 0px -12% 0px' },
    );
    visibility.observe(wrap);

    if (hero) {
      if (bootPending()) window.addEventListener(BOOT_DONE_EVENT, start, { once: true });
      else start();
    } else {
      wrap.dataset.glyphs = 'armed';
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(returnTimer);
      visibility.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener(BOOT_DONE_EVENT, start);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      wrap.removeEventListener('click', onClick);
      delete wrap.dataset.glyphs;
    };
  }, [text, words, hero]);

  return (
    <span ref={wrapRef} className={className}>
      <span ref={textRef} data-glyph-text>
        {text}
      </span>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute" />
    </span>
  );
}

/** The hero name. A click morphs it through `words` and back. */
export function GlyphName({ text, words }: { text: string; words: readonly string[] }) {
  return <Glyphs text={text} words={words} hero className="relative block" />;
}

/** A section title, kept in glyphs once it has assembled. */
export function GlyphTitle({ text }: { text: string }) {
  return <Glyphs text={text} className="relative inline-block" />;
}
