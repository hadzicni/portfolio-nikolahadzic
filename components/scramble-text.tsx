'use client';

import * as React from 'react';

import { cn } from 'cn';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01';

/**
 * Reveals text by cycling random glyphs into place, one column at a time.
 *
 * The final text is also rendered invisibly underneath so the box keeps its
 * final size — without it a proportional font makes the line jump around while
 * the random glyphs cycle. Skipped when the visitor asked for reduced motion.
 */
export function ScrambleText({
  text,
  className,
  delay = 0,
  speed = 28,
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}) {
  const [output, setOutput] = React.useState(text);

  React.useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduced) return;

    let frame = 0;
    let interval: ReturnType<typeof setInterval>;

    const start = setTimeout(() => {
      interval = setInterval(() => {
        frame += 1;
        const settled = Math.floor(frame / 2);

        if (settled >= text.length) {
          setOutput(text);
          clearInterval(interval);
          return;
        }

        setOutput(
          text
            .split('')
            .map((char, i) => {
              if (i < settled || char === ' ') return char;
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join('')
        );
      }, speed);
    }, delay);

    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [text, delay, speed]);

  return (
    <span className={cn('relative inline-block', className)}>
      <span aria-hidden className="invisible">
        {text}
      </span>
      <span className="absolute inset-0">{output}</span>
    </span>
  );
}
