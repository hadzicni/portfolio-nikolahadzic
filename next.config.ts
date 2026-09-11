import { execSync } from 'node:child_process';
import type { NextConfig } from 'next';

/**
 * The commit this bundle was built from.
 *
 * CI passes it in as a build argument because `.git` is excluded from the
 * Docker build context. Locally there is no argument, so we ask git directly.
 */
function buildCommit() {
  if (process.env.BUILD_COMMIT) {
    return process.env.BUILD_COMMIT.slice(0, 7);
  }

  try {
    return execSync('git rev-parse --short HEAD', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    // No git, no argument — the page simply omits the commit.
    return '';
  }
}

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_BUILD_COMMIT: buildCommit(),
    NEXT_PUBLIC_BUILD_TIME: process.env.BUILD_TIME ?? new Date().toISOString(),
  },
};

export default nextConfig;
