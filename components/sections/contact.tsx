import { GlobeIcon, MailIcon } from 'lucide-react';

import { profile } from '@/lib/content';
import { CopyEmailButton } from '@/components/copy-email-button';
import { GithubIcon } from '@/components/icons';
import { LinkButton } from '@/components/link-button';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';

const links = [
  {
    label: 'Email',
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: MailIcon,
  },
  {
    label: 'GitHub',
    value: `@${profile.handle}`,
    href: profile.github,
    icon: GithubIcon,
  },
  {
    label: 'Website',
    value: profile.website.replace('https://', ''),
    href: profile.website,
    icon: GlobeIcon,
  },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-border/70 py-20 sm:py-28"
    >
      <SectionHeading
        index="05"
        command="./say-hello.sh"
        title="Let's talk"
        description="Open to interesting projects, collaboration and a good argument about architecture. Email is the fastest route."
      />

      <ul className="mt-12 border-t border-border/70">
        {links.map((link, i) => (
          <Reveal key={link.label} delay={i * 60} as="li">
            <a
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer noopener"
              className="group/link flex items-center gap-4 border-b border-border/70 py-5 transition-colors hover:bg-muted/40 sm:px-2"
            >
              <link.icon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover/link:text-acid-ink" />
              <span className="mono-xs w-20 shrink-0 text-muted-foreground">
                {link.label}
              </span>
              <span className="truncate text-lg tracking-tight">
                {link.value}
              </span>
              <span className="mono-xs ml-auto hidden text-muted-foreground opacity-0 transition-opacity group-hover/link:opacity-100 sm:block">
                open &rarr;
              </span>
            </a>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={80} className="mt-8 flex flex-wrap gap-2.5">
        <LinkButton
          href={`mailto:${profile.email}`}
          size="lg"
          className="h-10 px-5 text-sm"
        >
          <MailIcon data-icon="inline-start" />
          Write me
        </LinkButton>
        <CopyEmailButton email={profile.email} />
      </Reveal>
    </section>
  );
}
