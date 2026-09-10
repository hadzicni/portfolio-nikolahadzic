import { ArrowUpRightIcon, ExternalLinkIcon } from 'lucide-react';

import { profile, projects } from '@/lib/content';
import { GithubIcon } from '@/components/icons';
import { LinkButton } from '@/components/link-button';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { Badge } from '@/components/ui/badge';

export function Projects() {
  const [featured, ...rest] = projects;

  return (
    <section
      id="projects"
      className="scroll-mt-20 border-t border-border/70 py-20 sm:py-28"
    >
      <SectionHeading
        index="03"
        command="git log --oneline"
        title="Things I built"
        description="Side projects and tooling, mostly born from a problem I ran into myself. All of it is public."
      />

      <Reveal delay={80} className="mt-12">
        <article className="relative overflow-hidden rounded-xl border border-border/70 bg-card p-6 sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-24 size-80 rounded-full bg-acid/10 blur-3xl"
          />

          <div className="relative">
            <div className="flex items-center gap-3">
              <featured.icon className="size-5 text-acid-ink" />
              <span className="mono-xs text-muted-foreground">
                {profile.handle}/{featured.name}
              </span>
              <Badge
                variant="outline"
                className="ml-auto border-acid/40 text-acid-ink"
              >
                Featured
              </Badge>
            </div>

            <h3 className="serif mt-5 text-4xl sm:text-5xl">
              {featured.title}
            </h3>

            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              {featured.description}
            </p>

            <ul className="mono-xs mt-5 flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
              {featured.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {featured.demo ? (
                <LinkButton
                  href={featured.demo}
                  external
                  className="h-9 px-4 text-sm"
                >
                  <ExternalLinkIcon data-icon="inline-start" />
                  Live demo
                </LinkButton>
              ) : null}
              <LinkButton
                href={featured.repo}
                external
                variant="outline"
                className="h-9 px-4 text-sm"
              >
                <GithubIcon data-icon="inline-start" />
                Source
              </LinkButton>
            </div>
          </div>
        </article>
      </Reveal>

      <ol className="mt-14 border-t border-border/70">
        {rest.map((project, i) => (
          <Reveal key={project.name} delay={i * 50} as="li">
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="group/row grid items-baseline gap-x-6 gap-y-2 border-b border-border/70 py-6 transition-colors hover:bg-muted/40 sm:grid-cols-[3rem_1fr_8rem] sm:px-2"
            >
              <span className="mono-xs text-muted-foreground/70">
                {String(i + 2).padStart(2, '0')}
              </span>

              <span>
                <span className="flex items-center gap-2 text-xl tracking-tight">
                  {project.title}
                  <ArrowUpRightIcon className="size-4 text-muted-foreground opacity-0 transition-all group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:opacity-100" />
                </span>
                <span className="mt-1.5 block max-w-lg text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </span>
              </span>

              <span className="mono-xs text-muted-foreground sm:text-right">
                {project.language}
              </span>
            </a>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={60} className="mt-8">
        <LinkButton
          href={profile.github}
          external
          variant="outline"
          className="h-9 px-4 text-sm"
        >
          <GithubIcon data-icon="inline-start" />
          Every repository on GitHub
        </LinkButton>
      </Reveal>
    </section>
  );
}
