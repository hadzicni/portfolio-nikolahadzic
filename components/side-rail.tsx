'use client';

import { GlobeIcon, MailIcon, MapPinIcon, MenuIcon } from 'lucide-react';

import { cn } from 'cn';
import { navigation, profile } from '@/lib/content';
import { useActiveSection } from '@/lib/use-active-section';
import { GithubIcon } from '@/components/icons';
import { LinkButton } from '@/components/link-button';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const socials = [
  { href: profile.github, label: 'GitHub', icon: GithubIcon, external: true },
  { href: profile.website, label: 'Website', icon: GlobeIcon, external: true },
  { href: `mailto:${profile.email}`, label: 'Email', icon: MailIcon },
];

/**
 * The identity column. Fixed beside the content on large screens, collapsed
 * into a slim bar at the top on small ones.
 */
export function SideRail() {
  const active = useActiveSection();

  return (
    <>
      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col justify-between border-r border-border/70 bg-background px-8 pt-12 pb-14 lg:flex">
        <div>
          <a href="#top" className="group/brand block">
            <span className="mono-xs text-muted-foreground">
              {profile.handle}
            </span>
            <h1 className="serif mt-1 text-3xl">{profile.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {profile.role}
            </p>
          </a>

          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPinIcon className="size-3.5" />
            {profile.location}
          </p>

          <nav className="mt-12 flex flex-col gap-px">
            {navigation.map((item) => {
              const current = active === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group/nav flex items-baseline gap-3 py-2 text-sm transition-colors',
                    current
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span
                    className={cn(
                      'mono-xs transition-colors',
                      current ? 'text-acid-ink' : 'text-muted-foreground/60'
                    )}
                  >
                    {item.index}
                  </span>
                  <span className="relative">
                    {item.label}
                    <span
                      className={cn(
                        'absolute -bottom-0.5 left-0 h-px bg-acid transition-all duration-300',
                        current ? 'w-full' : 'w-0 group-hover/nav:w-full'
                      )}
                    />
                  </span>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          {socials.map((social) => (
            <LinkButton
              key={social.label}
              href={social.href}
              external={social.external}
              variant="ghost"
              size="icon-sm"
              aria-label={social.label}
            >
              <social.icon />
            </LinkButton>
          ))}
        </div>
      </aside>

      {/* Mobile bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/70 bg-background/85 px-5 backdrop-blur-md lg:hidden">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="serif text-lg">{profile.name}</span>
          <span className="mono-xs text-muted-foreground">
            {profile.handle}
          </span>
        </a>

        <div className="ml-auto flex items-center gap-1">
          <LinkButton
            href={profile.github}
            external
            variant="ghost"
            size="icon-sm"
            aria-label="GitHub profile"
          >
            <GithubIcon />
          </LinkButton>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Open menu" />
              }
            >
              <MenuIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {navigation.map((item) => (
                <DropdownMenuItem
                  key={item.href}
                  render={<a href={item.href} />}
                >
                  <span className="mono-xs text-muted-foreground">
                    {item.index}
                  </span>
                  {item.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem render={<a href={`mailto:${profile.email}`} />}>
                <MailIcon />
                Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
