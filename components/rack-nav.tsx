'use client';

import { cn } from 'cn';
import { navigation } from '@/lib/content';
import { useActiveSection } from '@/lib/use-active-section';

/** Blink rates per unit, in seconds. Fixed so server and client render alike. */
const LED_SPEEDS = [
  [0.9, 1.7],
  [1.3, 0.6],
  [0.7, 2.1],
  [1.9, 1.1],
  [1.1, 0.8],
];

/**
 * The section navigation as a server rack. Every section is a rack unit; the
 * one in view slides out with its lights racing.
 *
 * The rack stays flat on purpose: any 3D tilt makes the browser resample it,
 * which softens the hairline borders and the text.
 *
 * Underneath it is an ordinary list of links, so keyboards and screen readers
 * get a plain nav.
 */
export function RackNav() {
  const active = useActiveSection();

  return (
    <nav aria-label="Sections" className="mt-12">
      {navigation.map((item, i) => {
        const current = active === item.href;
        const [first, second] = LED_SPEEDS[i % LED_SPEEDS.length];

        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={current ? 'location' : undefined}
            className={cn(
              'mb-1.5 flex h-9 items-center gap-2.5 rounded-[3px] border bg-card px-2.5 text-sm transition-[translate,border-color,color] duration-500 ease-[cubic-bezier(0.2,0.9,0.25,1.25)] motion-reduce:transition-none',
              current
                ? 'translate-x-3 border-acid/60 text-foreground'
                : 'border-border text-muted-foreground hover:translate-x-1 hover:text-foreground',
            )}
          >
            <span aria-hidden className="size-1 rounded-full bg-border" />
            <span aria-hidden className="flex gap-1">
              {[first, second].map((speed, led) => (
                <span
                  key={led}
                  className={cn('animate-led size-1.5 rounded-full', current ? 'bg-acid' : 'bg-acid/35')}
                  style={{ ['--led-speed' as string]: `${current ? speed / 3 : speed}s` }}
                />
              ))}
            </span>
            <span className="mono-xs text-muted-foreground/70">U{i + 1}</span>
            <span>{item.label}</span>
            <span aria-hidden className="ml-auto flex gap-0.5">
              {[0, 1, 2, 3].map((bay) => (
                <span key={bay} className="h-2.5 w-3 rounded-[1px] border border-border" />
              ))}
            </span>
            <span aria-hidden className="size-1 rounded-full bg-border" />
          </a>
        );
      })}
    </nav>
  );
}
