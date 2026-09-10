import { ArrowDownIcon } from 'lucide-react';

import { facts, profile } from '@/lib/content';
import { GithubIcon } from '@/components/icons';
import { LinkButton } from '@/components/link-button';
import { Reveal } from '@/components/reveal';
import { ScrambleText } from '@/components/scramble-text';
import { Terminal } from '@/components/terminal';

export function Hero() {
  return (
    <section id="top" className="relative">
      <div
        aria-hidden
        className="ruled pointer-events-none absolute inset-x-0 top-0 h-144"
      />

      <div className="relative pt-16 pb-24 sm:pt-24">
        <Reveal>
          <span className="mono-xs inline-flex items-center gap-2 text-muted-foreground">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-acid opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-acid" />
            </span>
            available for collaboration
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="serif mt-6 text-[clamp(2.75rem,7vw,5.5rem)]">
            <ScrambleText text="Nikola Hadzic" />
            <span className="mt-1 block text-muted-foreground italic">
              builds software that stays
              <br className="hidden sm:block" /> readable at scale.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {profile.intro}
          </p>
        </Reveal>

        <Reveal delay={220} className="mt-8 flex flex-wrap gap-2.5">
          <LinkButton href="#projects" size="lg" className="h-10 px-5 text-sm">
            See the work
            <ArrowDownIcon data-icon="inline-end" />
          </LinkButton>
          <LinkButton
            href={profile.github}
            external
            size="lg"
            variant="outline"
            className="h-10 px-5 text-sm"
          >
            <GithubIcon data-icon="inline-start" />
            GitHub
          </LinkButton>
        </Reveal>

        <Reveal delay={300} className="mt-16">
          <Terminal />
          <p className="mono-xs mt-3 text-muted-foreground">
            not a screenshot — try{' '}
            <span className="text-acid-ink">whoami</span> or{' '}
            <span className="text-acid-ink">neofetch</span>
          </p>
        </Reveal>

        <Reveal
          delay={80}
          as="dl"
          className="mt-16 grid grid-cols-2 border-t border-border/70 sm:grid-cols-4"
        >
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="border-b border-border/70 py-4 pr-4 sm:border-b-0"
            >
              <dt className="mono-xs text-muted-foreground">{fact.label}</dt>
              <dd className="mt-1.5 text-sm">{fact.value}</dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
