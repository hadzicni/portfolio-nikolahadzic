# nikolahadzic.dev

Personal portfolio of Nikola Hadzic — software developer in Basel, Switzerland.

Laid out like a workspace rather than a landing page: a fixed identity rail on
the left, an editorial column in the middle, and a status line pinned to the
bottom of the window in the spirit of tmux.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [Tailwind CSS](https://tailwindcss.com) v4
- [shadcn/ui](https://ui.shadcn.com) on [Base UI](https://base-ui.com)
- [next-themes](https://github.com/pacocoursey/next-themes) for light/dark
- Bricolage Grotesque, Inter and JetBrains Mono via `next/font`

## What is on the page

- A boot sequence in a floating terminal window, once per browser session.
- A working shell in the hero. Type `help`, `whoami`, `stack`, `projects`,
  `contact`, `neofetch`, `uptime`, `theme` or `clear`. Arrow keys walk the
  history.
- A status line showing the current section, scroll progress, the commit the
  page was built from and the local time in Basel.
- A career timeline, newest first, with the running position marked.
- A command palette on `Cmd/Ctrl+K` for sections, repositories and actions.
- A curated projects list whose numbers are live: stars, language and last
  push come from the GitHub API. A failed request falls back to the copy in
  `lib/content.ts`.
- A 404 page that answers the way a shell would.
- Scroll reveals, a scrambling headline and a slow keyword ticker.

Every motion effect is disabled under `prefers-reduced-motion`.

## Development

```bash
npm install
npm run dev
```

The site runs at [localhost:3000](http://localhost:3000).

## Editing the content

All copy lives in [`lib/content.ts`](lib/content.ts) — profile details, the
career timeline, tech stack, projects, ticker strings, boot lines and the
terminal's command list.
The sections in `components/sections/` render from that file, so text changes
rarely need a component change.

The projects list is deliberately closed: only what `lib/content.ts` names is
shown, in the order it names it, with its hand-written description.
[`lib/github.ts`](lib/github.ts) merges in stars, language and last push once
an hour and nothing else — a repository that is not in the content file never
reaches the page.

Design tokens (the warm paper palette, the green accent, the `display`/`ruled`
utilities and the always-dark `terminal-dark` surface) sit at the bottom of
[`app/globals.css`](app/globals.css).

## Build

```bash
npm run build
npm run start
```

## Checks

```bash
npm run typecheck
npm run lint
```

Both run in CI on every push and pull request via
`.github/workflows/lint.yml`.

### Build provenance

The status line links the commit the bundle was built from, and the terminal's
`uptime` reports how long that build has been live. Both read values inlined by
the `env` block in `next.config.ts`.

Locally the commit comes from `git rev-parse`. `.git` is excluded from the
Docker build context, so the image build takes it as arguments instead:

```bash
docker build   --build-arg BUILD_COMMIT="$(git rev-parse HEAD)"   --build-arg BUILD_TIME="$(date -u +%Y-%m-%dT%H:%M:%SZ)"   -t portfolio .
```

Without either source the page simply omits the commit — nothing breaks.

A `Dockerfile` is included and the image is published by the workflow in
`.github/workflows/docker-publish.yml`, which passes both arguments. That workflow runs independently of the
checks above — add `needs: lint` to it if you want a failing lint to block the
deploy.
