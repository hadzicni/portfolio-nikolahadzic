import { profile } from '@/lib/content';

/**
 * Which build the visitor is looking at.
 *
 * The values are inlined at build time by the `env` block in `next.config.ts`,
 * so they are readable on the client. They must be accessed as full member
 * expressions — destructuring `process.env` defeats the inlining.
 */

const commit = process.env.NEXT_PUBLIC_BUILD_COMMIT || '';
const builtAtRaw = process.env.NEXT_PUBLIC_BUILD_TIME || '';

const builtAt = builtAtRaw ? new Date(builtAtRaw) : null;

export const buildInfo = {
  commit,
  /** Null when the build had neither git nor a build argument available. */
  commitUrl: commit ? `${profile.repo}/commit/${commit}` : null,
  builtAt: builtAt && !Number.isNaN(builtAt.getTime()) ? builtAt : null,
};

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
});

/** "8 Sep 2026, 14:02 UTC" */
export function formatBuildTime(date: Date) {
  return `${dateFormat.format(date)} UTC`;
}

/**
 * How long this build has been live, in the shape `uptime` would print it:
 * "3 days, 4:12" or, under a day, "4:12".
 */
export function formatUptime(since: Date, now: Date = new Date()) {
  const seconds = Math.max(0, Math.floor((now.getTime() - since.getTime()) / 1000));

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const clock = `${hours}:${String(minutes).padStart(2, '0')}`;

  if (days === 0) return clock;
  return `${days} ${days === 1 ? 'day' : 'days'}, ${clock}`;
}
