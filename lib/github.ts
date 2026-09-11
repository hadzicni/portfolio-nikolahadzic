import { profile, projects, type Project } from '@/lib/content';

/** One hour. The page revalidates on the same schedule. */
const REVALIDATE = 3600;

const API = `https://api.github.com/users/${profile.handle}/repos?sort=pushed&per_page=100`;

type GithubRepo = {
  name: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
};

export type RepoStats = {
  stars: number;
  forks: number;
  language: string | null;
  pushedAt: string;
};

/** A curated project plus whatever GitHub currently reports about it. */
export type ProjectEntry = Project & { stats: RepoStats | null };

/**
 * Reads the public repositories. A failure here is not worth breaking the page
 * over — the curated copy in `lib/content.ts` is the fallback, so an offline
 * build or a rate-limited response simply renders without the live numbers.
 */
async function fetchRepos(): Promise<GithubRepo[]> {
  try {
    const response = await fetch(API, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': `${profile.handle}-portfolio`,
      },
      next: { revalidate: REVALIDATE },
    });

    if (!response.ok) {
      console.warn(`GitHub returned ${response.status}, using curated data`);
      return [];
    }

    return (await response.json()) as GithubRepo[];
  } catch (error) {
    console.warn('GitHub request failed, using curated data', error);
    return [];
  }
}

/**
 * Only what `lib/content.ts` lists, in the order it lists it. GitHub supplies
 * the numbers that go stale — stars, language and last push — and nothing else.
 * A repository that is not in that file never appears on the page.
 */
export async function getProjects(): Promise<ProjectEntry[]> {
  const repos = await fetchRepos();
  const byName = new Map(repos.map((repo) => [repo.name, repo]));

  return projects.map((project) => {
    const repo = byName.get(project.name);

    return {
      ...project,
      stats: repo
        ? {
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            pushedAt: repo.pushed_at,
          }
        : null,
    };
  });
}

const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
];

/** "3 days ago", "last week", "yesterday". */
export function timeAgo(iso: string) {
  const seconds = (Date.now() - new Date(iso).getTime()) / 1000;

  for (const [unit, size] of UNITS) {
    if (seconds >= size) {
      return relative.format(-Math.floor(seconds / size), unit);
    }
  }

  return 'just now';
}
