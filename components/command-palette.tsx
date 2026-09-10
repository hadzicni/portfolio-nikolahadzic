"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  ExternalLinkIcon,
  HashIcon,
  MailIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react"

import { navigation, profile, projects } from "@/lib/content"
import { GithubIcon } from "@/components/icons"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

/** Cmd/Ctrl+K palette for jumping around and opening links. */
export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  React.useEffect(() => {
    function onOpen() {
      setOpen(true)
    }
    window.addEventListener("open-command-palette", onOpen)
    return () => window.removeEventListener("open-command-palette", onOpen)
  }, [])

  function run(action: () => void) {
    setOpen(false)
    action()
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="soft-lg top-1/4"
    >
      <Command>
        <CommandInput placeholder="Jump to a section, open a repo…" />
        <CommandList>
          <CommandEmpty>Nothing matches that.</CommandEmpty>

          <CommandGroup heading="Sections">
            {navigation.map((item) => (
              <CommandItem
                key={item.href}
                value={item.label}
                onSelect={() =>
                  run(() => {
                    document
                      .querySelector(item.href)
                      ?.scrollIntoView({ behavior: "smooth" })
                  })
                }
              >
                <HashIcon />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Repositories">
            {projects.map((project) => (
              <CommandItem
                key={project.name}
                value={project.name}
                onSelect={() => run(() => window.open(project.repo, "_blank"))}
              >
                <ExternalLinkIcon />
                {project.title}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Actions">
            <CommandItem
              value="email"
              onSelect={() =>
                run(() => {
                  window.location.href = `mailto:${profile.email}`
                })
              }
            >
              <MailIcon />
              Send an email
            </CommandItem>
            <CommandItem
              value="github"
              onSelect={() => run(() => window.open(profile.github, "_blank"))}
            >
              <GithubIcon />
              GitHub profile
            </CommandItem>
            <CommandItem
              value="theme toggle dark light"
              onSelect={() =>
                run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))
              }
            >
              {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
              Toggle theme
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
