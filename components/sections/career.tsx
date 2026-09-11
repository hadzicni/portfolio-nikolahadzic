import { BriefcaseIcon, GraduationCapIcon } from 'lucide-react';

import { cn } from 'cn';
import { career } from '@/lib/content';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';

const ICONS = {
  work: BriefcaseIcon,
  education: GraduationCapIcon,
};

export function Career() {
  return (
    <section
      id="career"
      className="scroll-mt-20 border-t border-border/70 py-20 sm:py-28"
    >
      <SectionHeading
        index="02"
        command="history --reverse"
        title="The path here"
        description="Where I have worked and what I learned along the way, newest first."
      />

      <ol className="mt-12">
        {career.map((entry, i) => {
          const Icon = ICONS[entry.kind];

          return (
            <Reveal key={`${entry.organisation}-${entry.title}`} delay={i * 70} as="li">
              <div className="group/entry relative grid gap-x-8 gap-y-3 pb-10 sm:grid-cols-[9rem_1fr]">
                {/* The rail. It stops at the last entry rather than running off. */}
                <span
                  aria-hidden
                  className={cn(
                    'absolute top-2 left-1.25 w-px bg-border sm:left-[calc(9rem+2rem+5px)]',
                    i === career.length - 1 ? 'h-0' : 'bottom-0'
                  )}
                />

                <div className="mono-xs flex items-center gap-2 self-start pt-1 text-muted-foreground">
                  <Icon className="size-3.5" />
                  {entry.period}
                </div>

                <div className="relative pl-6 sm:pl-6">
                  <span
                    aria-hidden
                    className={cn(
                      'absolute top-2 left-0 size-2.75 rounded-full border-2 border-background ring-1',
                      entry.current
                        ? 'bg-acid ring-acid'
                        : 'bg-muted-foreground/40 ring-border'
                    )}
                  />

                  <h3 className="text-lg font-medium tracking-tight">
                    {entry.title}
                  </h3>
                  <p className="mt-0.5 text-muted-foreground">
                    {entry.organisation}
                    <span className="mx-2 opacity-40">/</span>
                    {entry.location}
                  </p>

                  <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
                    {entry.summary}
                  </p>

                  {entry.highlights?.length ? (
                    <ul className="mt-4 space-y-2">
                      {entry.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex max-w-xl gap-3 text-sm leading-relaxed text-muted-foreground"
                        >
                          <span className="text-acid-ink">—</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
