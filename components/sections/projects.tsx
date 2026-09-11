import { ArrowUpRightIcon, ExternalLinkIcon, StarIcon } from 'lucide-react';

import { profile } from '@/lib/content';
import { getProjects, timeAgo, type ProjectEntry } from '@/lib/github';
import { GithubIcon } from '@/components/icons';
import { LinkButton } from '@/components/link-button';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { Badge } from '@/components/ui/badge';

/** Stars and last push, shown only where GitHub actually answered. */
function Stats({ project }: { project: ProjectEntry }) {
  const { stats } = project;
  const language = stats?.language || project.language;

  return (
    <span className="mono-xs flex items-center gap-3 text-muted-foreground">
      {language ? <span>{language}</span> : null}
      {stats && stats.stars > 0 ? (
        <span className="flex items-center gap-1">
          <StarIcon className="size-3" />
          {stats.stars}
        </span>
      ) : null}
      {stats ? <span>{timeAgo(stats.pushedAt)}</span> : null}
    </span>
  );
}

export async function Projects() {
  const entries = await getProjects();
  const [featured, ...rest] = entries;
  const live = entries.some((entry) => entry.stats !== null);

  // The live language already appears in the stats line, so drop it from the
  // hand-written tag list to avoid printing it twice.
  const featuredLanguage = featured.stats?.language || featured.language;
  const featuredTags = featured.tags.filter(
    (tag) => tag.toLowerCase() !== featuredLanguage.toLowerCase()
  );

  return (
    <section
      id="projects"
      className="scroll-mt-20 border-t border-border/70 py-20 sm:py-28"
    >
      <SectionHeading
        index="03"
        command="git log --oneline"
        title="Things I built"
        description="Side projects and tooling, mostly born from a problem I ran into myself. All of it is public, and the numbers come straight from GitHub."
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

            <h3 className="display mt-5 text-4xl sm:text-5xl">
              {featured.title}
            </h3>

            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              {featured.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Stats project={featured} />
              {featuredTags.length ? (
                <ul className="mono-xs flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
                  {featuredTags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              ) : null}
            </div>

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
          <Reveal key={project.name} delay={Math.min(i, 4) * 50} as="li">
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="group/row grid items-baseline gap-x-6 gap-y-2 border-b border-border/70 py-6 transition-colors hover:bg-muted/40 sm:grid-cols-[3rem_1fr_11rem] sm:px-2"
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

              <span className="sm:justify-self-end">
                <Stats project={project} />
              </span>
            </a>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={60} className="mt-8 flex flex-wrap items-center gap-4">
        <LinkButton
          href={profile.github}
          external
          variant="outline"
          className="h-9 px-4 text-sm"
        >
          <GithubIcon data-icon="inline-start" />
          Every repository on GitHub
        </LinkButton>

        {live ? (
          <span className="mono-xs flex items-center gap-2 text-muted-foreground">
            <span className="size-1.5 rounded-full bg-acid" />
            synced from the GitHub API
          </span>
        ) : null}
      </Reveal>
    </section>
  );
}
