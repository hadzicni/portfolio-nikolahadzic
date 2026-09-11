'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import {
  ArrowUpRightIcon,
  CopyIcon,
  CornerDownLeftIcon,
  MailIcon,
  MoonIcon,
  SunIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { navigation, profile, projects } from '@/lib/content';
import { GithubIcon } from '@/components/icons';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Kbd, KbdGroup } from '@/components/ui/kbd';

/** A square tile so every row has an anchor at the same position. */
function Tile({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border/70 bg-muted/50 text-muted-foreground transition-colors group-data-selected/command-item:border-acid/30 group-data-selected/command-item:bg-acid/10 group-data-selected/command-item:text-acid-ink">
      {children}
    </span>
  );
}

/** Right-hand hint, and the arrow that appears on the selected row. */
function Hint({ children }: { children: React.ReactNode }) {
  return (
    <span
      data-slot="command-shortcut"
      className="mono-xs ml-auto flex items-center gap-2 text-muted-foreground"
    >
      {children}
      <CornerDownLeftIcon className="size-3 opacity-0 transition-opacity group-data-selected/command-item:opacity-100" />
    </span>
  );
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  React.useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener('open-command-palette', onOpen);
    return () => window.removeEventListener('open-command-palette', onOpen);
  }, []);

  function run(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="soft-lg top-[16%] w-[calc(100%-2rem)] border-border/70 sm:max-w-xl"
    >
      <Command loop>
        <CommandInput placeholder="Jump to a section, open a repo…" />

        <CommandList>
          <CommandEmpty>
            Nothing matches that. Try a section or a project name.
          </CommandEmpty>

          <CommandGroup heading="Sections">
            {navigation.map((item) => (
              <CommandItem
                key={item.href}
                value={`${item.label} section`}
                onSelect={() =>
                  run(() => {
                    document
                      .querySelector(item.href)
                      ?.scrollIntoView({ behavior: 'smooth' });
                  })
                }
              >
                <Tile>
                  <span className="mono-xs">{item.index}</span>
                </Tile>
                <span className="capitalize">{item.label}</span>
                <Hint>section</Hint>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Repositories">
            {projects.map((project) => (
              <CommandItem
                key={project.name}
                value={`${project.title} ${project.name} ${project.language}`}
                onSelect={() => run(() => window.open(project.repo, '_blank'))}
              >
                <Tile>
                  <project.icon />
                </Tile>
                <span>{project.title}</span>
                <Hint>{project.language}</Hint>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Actions">
            <CommandItem
              value="email write contact"
              onSelect={() =>
                run(() => {
                  window.location.href = `mailto:${profile.email}`;
                })
              }
            >
              <Tile>
                <MailIcon />
              </Tile>
              <span>Send an email</span>
              <Hint>{profile.email}</Hint>
            </CommandItem>

            <CommandItem
              value="copy email address clipboard"
              onSelect={() =>
                run(async () => {
                  try {
                    await navigator.clipboard.writeText(profile.email);
                    toast.success('Copied to clipboard', {
                      description: profile.email,
                    });
                  } catch {
                    toast.error('Could not copy the address');
                  }
                })
              }
            >
              <Tile>
                <CopyIcon />
              </Tile>
              <span>Copy email address</span>
              <Hint>clipboard</Hint>
            </CommandItem>

            <CommandItem
              value="github profile repositories"
              onSelect={() => run(() => window.open(profile.github, '_blank'))}
            >
              <Tile>
                <GithubIcon />
              </Tile>
              <span>GitHub profile</span>
              <Hint>
                @{profile.handle}
                <ArrowUpRightIcon className="size-3" />
              </Hint>
            </CommandItem>

            <CommandItem
              value="theme toggle dark light appearance"
              onSelect={() =>
                run(() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'))
              }
            >
              <Tile>
                {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </Tile>
              <span>
                Switch to {resolvedTheme === 'dark' ? 'light' : 'dark'} mode
              </span>
              <Hint>theme</Hint>
            </CommandItem>
          </CommandGroup>
        </CommandList>

        <div className="flex items-center gap-4 border-t border-border/70 px-4 py-2.5">
          <span className="mono-xs flex items-center gap-1.5 text-muted-foreground">
            <KbdGroup>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
            </KbdGroup>
            navigate
          </span>
          <span className="mono-xs flex items-center gap-1.5 text-muted-foreground">
            <Kbd>↵</Kbd>
            open
          </span>
          <span className="mono-xs ml-auto flex items-center gap-1.5 text-muted-foreground">
            <Kbd>esc</Kbd>
            close
          </span>
        </div>
      </Command>
    </CommandDialog>
  );
}
