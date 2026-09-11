import { stack } from '@/lib/content';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';

export function Stack() {
  return (
    <section
      id="stack"
      className="scroll-mt-20 border-t border-border/70 py-20 sm:py-28"
    >
      <SectionHeading
        index="03"
        command="ls ~/toolbox"
        title="The toolbox"
        description="Picked for the job rather than the hype cycle. These are the things I use often enough to know their sharp edges."
      />

      <div className="mt-12 space-y-10">
        {stack.map((group, i) => (
          <Reveal
            key={group.id}
            delay={i * 60}
            className="grid gap-4 border-t border-border/70 pt-6 md:grid-cols-[13rem_1fr] md:gap-8"
          >
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium tracking-tight">
                <group.icon className="size-4 text-acid-ink" />
                {group.label}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {group.description}
              </p>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-2.5 self-start">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="group/item flex items-baseline gap-2 text-base tracking-tight"
                >
                  <span className="mono-xs text-muted-foreground/50 transition-colors group-hover/item:text-acid-ink">
                    /
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
