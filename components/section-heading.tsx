import { cn } from 'cn';

import { Reveal } from '@/components/reveal';

/**
 * Section header: the index sits out in the left margin on wide screens, the
 * title carries the serif voice.
 */
export function SectionHeading({
  index,
  command,
  title,
  description,
  className,
}: {
  index: string;
  command: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <Reveal className={cn('relative', className)}>
      <span
        aria-hidden
        className="mono-xs absolute -left-14 top-2 hidden text-muted-foreground/70 xl:block"
      >
        {index}
      </span>

      <div className="flex items-center gap-2.5">
        <span className="mono-xs text-muted-foreground xl:hidden">{index}</span>
        <span className="h-px w-6 bg-border xl:hidden" />
        <span className="mono-xs text-acid-ink">{command}</span>
      </div>

      <h2 className="serif mt-4 text-4xl sm:text-5xl">{title}</h2>

      {description ? (
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
