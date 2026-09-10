'use client';

import * as React from 'react';

import { navigation } from '@/lib/content';

/** Returns the href of whichever navigation section is currently in view. */
export function useActiveSection() {
  const [active, setActive] = React.useState<string>(navigation[0].href);

  React.useEffect(() => {
    const sections = navigation
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0];

        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}
