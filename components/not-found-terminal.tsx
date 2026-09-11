'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';

import { navigation, profile } from '@/lib/content';
import { GithubIcon } from '@/components/icons';
import { LinkButton } from '@/components/link-button';

const LINE_DELAY = 320;

const noopSubscribe = () => () => {};

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * A 404 that answers the way a shell would. The lines print one after another
 * so it reads as a session rather than a static error page.
 */
export function NotFoundTerminal() {
  const pathname = usePathname();
  const [typed, setTyped] = React.useState(0);
  const reduced = React.useSyncExternalStore(
    noopSubscribe,
    prefersReducedMotion,
    () => false
  );

  const lines = React.useMemo(
    () => [
      { prompt: true, text: `cd ${pathname}` },
      { prompt: false, text: `cd: no such file or directory: ${pathname}` },
      { prompt: true, text: 'ls ~' },
    ],
    [pathname]
  );

  React.useEffect(() => {
    if (reduced) return;

    const timers = lines.map((_, i) =>
      setTimeout(() => setTyped(i + 1), LINE_DELAY * (i + 1))
    );

    return () => timers.forEach(clearTimeout);
  }, [lines, reduced]);

  // Anyone who asked for less motion gets the whole session at once.
  const shown = reduced ? lines.length : typed;

  return (
    <main className="flex min-h-dvh items-center justify-center p-5 sm:p-8">
      <div className="w-full max-w-xl">
        <p className="display text-7xl sm:text-8xl">404</p>
        <p className="mt-3 text-muted-foreground">
          That path does not exist. The shell agrees.
        </p>

        <div className="terminal-dark soft-lg mt-8 overflow-hidden rounded-2xl bg-card text-left ring-1 ring-white/15">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-[11px] text-muted-foreground">
              {profile.handle} — zsh
            </span>
          </div>

          <div className="min-h-44 p-5 font-mono text-xs leading-relaxed sm:text-sm">
            {lines.slice(0, shown).map((line) => (
              <p
                key={line.text}
                className={
                  line.prompt
                    ? 'break-all'
                    : 'break-all text-hot'
                }
              >
                {line.prompt ? <span className="text-acid">$ </span> : null}
                {line.text}
              </p>
            ))}

            {shown >= lines.length ? (
              <p className="mt-1 flex flex-wrap gap-x-5 text-muted-foreground">
                {navigation.map((item) => (
                  <a
                    key={item.href}
                    href={`/${item.href}`}
                    className="transition-colors hover:text-acid"
                  >
                    {item.label}
                  </a>
                ))}
              </p>
            ) : null}

            <span className="mt-1 inline-block h-3.5 w-2 animate-blink bg-acid align-middle" />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2.5">
          <LinkButton href="/" size="lg" className="h-10 px-5 text-sm">
            <ArrowLeftIcon data-icon="inline-start" />
            Back to the start
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
        </div>
      </div>
    </main>
  );
}
