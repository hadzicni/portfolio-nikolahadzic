import type { CSSProperties } from 'react';

import { cn } from 'cn';

import { stack } from '@/lib/content';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';

/** Index for the line-by-line entrance in `globals.css`. */
const line = (index: number) => ({ '--line': index }) as CSSProperties;

/**
 * The toolbox as the output of `tree`: one directory per group, one file per
 * tool. When it scrolls into view the lines print one after another, the way
 * real output would arrive; after that it is a plain, static list.
 */
export function Stack() {
  const files = stack.reduce((count, group) => count + group.items.length, 0);
  let index = 0;

  return (
    <section
      id="stack"
      className="scroll-mt-20 border-t border-border/70 py-20 sm:py-28"
    >
      <SectionHeading
        index="03"
        command="tree ~/toolbox"
        title="The toolbox"
        description="Picked for the job rather than the hype cycle. These are the things I use often enough to know their sharp edges."
      />

      <Reveal className="mt-12 font-mono text-sm">
        <div className="grid gap-x-12 gap-y-9 sm:grid-cols-2">
          {stack.map((group) => (
            <div key={group.id}>
              <h3 data-line style={line(index++)} className="flex items-center gap-2 font-semibold text-foreground">
                <group.icon aria-hidden className="size-4 text-acid-ink" />
                {group.id}/
              </h3>
              <p data-line style={line(index++)} className="mt-1 text-xs leading-relaxed text-muted-foreground">
                # {group.description}
              </p>

              {/*
                The branches are borders, not box-drawing characters: the
                mono font ships without them, and the fallback draws them at
                the wrong width.
              */}
              <ul className="mt-2.5">
                {group.items.map((item, i) => (
                  <li
                    key={item}
                    data-line
                    style={line(index++)}
                    className={cn(
                      'group/file relative pl-7 leading-7 transition-colors hover:text-acid-ink',
                      'before:absolute before:top-0 before:left-1.5 before:border-l before:border-muted-foreground/35',
                      'after:absolute after:top-3.5 after:left-1.5 after:w-4 after:border-t after:border-muted-foreground/35',
                      'hover:after:border-acid-ink',
                      i === group.items.length - 1 ? 'before:h-3.5' : 'before:h-full',
                    )}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p data-line style={line(index++)} className="mt-9 text-xs text-muted-foreground">
          {stack.length} directories, {files} files
        </p>
      </Reveal>
    </section>
  );
}
