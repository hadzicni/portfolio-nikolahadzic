import { ArrowUpRightIcon } from 'lucide-react';

import { career } from '@/lib/content';
import { getProjects, timeAgo } from '@/lib/github';

type Row = {
  label: string;
  value: string;
  meta?: string;
  href?: string;
};

/**
 * What is going on right now, for the stretch of the side rail below the
 * navigation. Everything is derived — the featured project, the running career
 * entry and the latest push to a curated repository — so it never needs
 * editing by hand. Without GitHub the push row is simply left out.
 *
 * Each row is a value with one short mono line under it, so the panel keeps
 * an even rhythm in the narrow rail.
 */
export async function NowPanel() {
  const projects = await getProjects();

  const building = projects.find((project) => project.featured) ?? projects[0];
  const current = career.find((entry) => entry.current);
  const latest = projects
    .flatMap((project) => (project.stats ? [{ project, pushedAt: project.stats.pushedAt }] : []))
    .sort((a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt))[0];

  const rows: Row[] = [];

  if (building) {
    const href = building.demo ?? building.repo;
    rows.push({
      label: 'building',
      value: building.title,
      meta: new URL(href).host,
      href,
    });
  }

  if (current) {
    rows.push({
      label: current.kind === 'education' ? 'studying' : 'working',
      value: current.title,
      meta: current.period,
    });
  }

  if (latest) {
    rows.push({
      label: 'last push',
      value: latest.project.title,
      meta: timeAgo(latest.pushedAt),
      href: latest.project.repo,
    });
  }

  if (!rows.length) return null;

  return (
    <div className="border-t border-border/70 pt-5">
      <p className="mono-xs text-acid-ink">cat ~/now</p>

      <dl className="mt-4 space-y-3.5">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="mono-xs text-muted-foreground">{row.label}</dt>
            <dd className="mt-0.5 text-sm leading-snug">
              {row.href ? (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group/now inline-flex items-center gap-1 transition-colors hover:text-acid-ink"
                >
                  {row.value}
                  <ArrowUpRightIcon className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover/now:opacity-100" />
                </a>
              ) : (
                row.value
              )}
              {row.meta ? (
                <span className="mono-xs mt-0.5 block text-muted-foreground">{row.meta}</span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
