import { principles, profile } from '@/lib/content';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';

export function About() {
  return (
    <section
      id="whoami"
      className="scroll-mt-20 border-t border-border/70 py-20 sm:py-28"
    >
      <SectionHeading
        index="01"
        command="cat about.md"
        title="Whoami"
        description="The long version, in prose rather than bullet points."
      />

      <Reveal className="mt-12 max-w-2xl space-y-5 leading-relaxed text-muted-foreground">
        {profile.about.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </Reveal>

      <Reveal delay={80}>
        <blockquote className="serif mt-12 max-w-2xl text-3xl text-foreground italic sm:text-4xl">
          &ldquo;{profile.quote}&rdquo;
        </blockquote>
      </Reveal>

      <dl className="mt-16 grid gap-px border-t border-border/70 sm:grid-cols-2">
        {principles.map((principle, i) => (
          <Reveal
            key={principle.title}
            delay={i * 70}
            className="border-b border-border/70 py-6 pr-8"
          >
            <dt className="flex items-baseline gap-3">
              <span className="mono-xs text-acid-ink">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-base font-medium tracking-tight">
                {principle.title}
              </span>
            </dt>
            <dd className="mt-2 pl-8 text-sm leading-relaxed text-muted-foreground">
              {principle.body}
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
