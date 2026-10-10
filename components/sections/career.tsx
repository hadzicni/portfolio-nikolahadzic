import type { CSSProperties } from 'react';
import { BriefcaseIcon, Building2Icon, GraduationCapIcon, MapPinIcon } from 'lucide-react';

import { career, type CareerEntry } from '@/lib/content';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';

const KINDS = {
  work: { label: 'Work', icon: BriefcaseIcon },
  education: { label: 'Education', icon: GraduationCapIcon },
};

/** "2023 — present" gives 2023 and no end; "2019 — 2021" gives both. */
function parsePeriod(period: string) {
  const [from, to] = period.split('—').map((part) => part.trim());
  return {
    start: Number.parseInt(from, 10),
    end: /^\d{4}$/.test(to ?? '') ? Number.parseInt(to, 10) : null,
  };
}

/**
 * The period as a year axis. The bar fills from the first year to the last
 * one, or to today for a running entry, where a live dot marks the date. It
 * only draws what the period says; nothing is guessed about where it ends.
 */
function YearAxis({ period, current }: { period: string; current?: boolean }) {
  const { start, end } = parsePeriod(period);
  if (Number.isNaN(start)) return null;

  const now = new Date();
  const today = now.getFullYear() + (now.getMonth() + now.getDate() / 31) / 12;
  const last = end ?? now.getFullYear();
  const span = last + 1 - start;
  // A start that is still ahead has nothing to draw yet.
  if (span <= 0) return null;
  const fill = Math.min(1, Math.max(0, ((end === null ? today : end + 1) - start) / span));
  const years = Array.from({ length: span }, (_, i) => start + i);

  return (
    <div aria-hidden className="mt-10">
      <div className="relative h-1 rounded-full bg-muted">
        {years.slice(1).map((year, i) => (
          <span
            key={year}
            className="absolute top-1/2 h-2.5 w-px -translate-y-1/2 bg-border"
            style={{ left: `${((i + 1) / span) * 100}%` }}
          />
        ))}
        <div
          data-progress
          className="absolute inset-y-0 left-0 w-(--fill) rounded-full bg-acid"
          style={{ '--fill': `${fill * 100}%` } as CSSProperties}
        >
          {current ? (
            <span className="absolute top-1/2 right-0 flex size-3 translate-x-1/2 -translate-y-1/2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-acid opacity-60" />
              <span className="relative inline-flex size-3 rounded-full bg-acid ring-4 ring-acid/20" />
            </span>
          ) : null}
        </div>
      </div>

      <div className="relative mt-3 h-4">
        {years.map((year, i) => (
          <span
            key={year}
            className="mono-xs absolute text-muted-foreground"
            style={{ left: `${(i / span) * 100}%` }}
          >
            {year}
          </span>
        ))}
        {current ? (
          <span
            className="mono-xs absolute -translate-x-1/2 text-acid-ink max-sm:hidden"
            style={{ left: `${fill * 100}%`, top: '-2.4rem' }}
          >
            now
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** One entry, laid straight onto the page: no box around it. */
function CareerItem({ entry }: { entry: CareerEntry }) {
  const kind = KINDS[entry.kind];
  const places = entry.organisation.split(' / ');

  return (
    <article>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="mono-xs inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-muted-foreground">
          <kind.icon aria-hidden className="size-3.5" />
          {kind.label}
        </span>
        {entry.current ? (
          <span className="mono-xs inline-flex items-center gap-2 text-acid-ink">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-acid opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-acid" />
            </span>
            currently
          </span>
        ) : null}
        <span className="mono-xs ml-auto text-muted-foreground">{entry.period}</span>
      </div>

      {/* Smaller on phones, where one long German compound would not fit a
          line; anything longer still wraps instead of being cut off. */}
      <h3 className="display mt-5 text-[1.375rem] text-balance wrap-break-word hyphens-auto sm:text-4xl">
        {entry.title}
      </h3>

      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {places.map((place) => (
          <li key={place} className="inline-flex items-center gap-2">
            <Building2Icon aria-hidden className="size-3.5 text-acid-ink" />
            {place}
          </li>
        ))}
        <li className="inline-flex items-center gap-2">
          <MapPinIcon aria-hidden className="size-3.5 text-acid-ink" />
          {entry.location}
        </li>
      </ul>

      <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">{entry.summary}</p>

      {entry.highlights?.length ? (
        <ul className="mt-4 space-y-2">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="flex max-w-xl gap-3 text-sm leading-relaxed text-muted-foreground">
              <span className="text-acid-ink">—</span>
              {highlight}
            </li>
          ))}
        </ul>
      ) : null}

      <YearAxis period={entry.period} current={entry.current} />
    </article>
  );
}

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

      <ol className="mt-12 divide-y divide-border/70">
        {career.map((entry, i) => (
          <Reveal key={`${i}-${entry.title}`} delay={i * 70} as="li" className="py-12 first:pt-0 last:pb-0">
            <CareerItem entry={entry} />
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
