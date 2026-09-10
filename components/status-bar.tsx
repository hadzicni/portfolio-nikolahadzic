'use client';

import * as React from 'react';
import { SearchIcon } from 'lucide-react';

import { navigation, profile } from '@/lib/content';
import { useActiveSection } from '@/lib/use-active-section';
import { ThemeToggle } from '@/components/theme-toggle';
import { Kbd, KbdGroup } from '@/components/ui/kbd';

const clock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Zurich',
  hour: '2-digit',
  minute: '2-digit',
});

/** Ticks once a second but only re-renders when the printed minute changes. */
function useBaselTime() {
  return React.useSyncExternalStore(
    (onChange) => {
      const id = setInterval(onChange, 1000);
      return () => clearInterval(id);
    },
    () => clock.format(new Date()),
    () => ''
  );
}

/**
 * A status line pinned to the bottom of the window, in the spirit of tmux or
 * vim: where you are, how far you have scrolled, and what time it is here.
 */
export function StatusBar() {
  const active = useActiveSection();
  const progressRef = React.useRef<HTMLDivElement>(null);
  const time = useBaselTime();

  React.useEffect(() => {
    function onScroll() {
      const bar = progressRef.current;
      if (!bar) return;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = `scaleX(${ratio})`;
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const current = navigation.find((item) => item.href === active);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/85 backdrop-blur-md">
      <div
        aria-hidden
        className="h-px w-full origin-left scale-x-0 bg-acid transition-transform duration-150 ease-out"
        ref={progressRef}
      />

      <div className="flex h-9 items-center gap-3 px-4 sm:px-6">
        <span className="mono-xs flex items-center gap-2 text-muted-foreground">
          <span className="size-1.5 rounded-full bg-acid" />
          <span className="hidden sm:inline">~/portfolio</span>
          <span className="text-foreground">
            {current ? `${current.index} ${current.label}` : 'top'}
          </span>
        </span>

        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(new Event('open-command-palette'))
          }
          className="mono-xs ml-auto hidden items-center gap-2 text-muted-foreground transition-colors hover:text-foreground sm:flex"
        >
          <SearchIcon className="size-3" />
          search
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </button>

        <span className="mono-xs ml-auto text-muted-foreground sm:ml-4">
          {profile.location.split(',')[0]} {time}
        </span>

        <ThemeToggle />
      </div>
    </div>
  );
}
