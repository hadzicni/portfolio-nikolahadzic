"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { cn } from "cn"
import {
  neofetch,
  profile,
  projects,
  stack,
  terminalHelp,
} from "@/lib/content"
import { Badge } from "@/components/ui/badge"

type Line = { kind: "input" | "output" | "error" | "accent"; text: string }

const WELCOME: Line[] = [
  { kind: "accent", text: `${profile.name} — interactive shell` },
  { kind: "output", text: "Type a command and press Enter. Try: help" },
  { kind: "output", text: "" },
]

function runCommand(
  raw: string,
  toggleTheme: () => string
): Line[] | "clear" {
  const command = raw.trim().toLowerCase()

  if (!command) return []
  if (command === "clear") return "clear"

  if (command === "help") {
    return [
      { kind: "accent", text: "available commands" },
      ...terminalHelp.map<Line>(([name, description]) => ({
        kind: "output",
        text: `  ${name.padEnd(10)} ${description}`,
      })),
    ]
  }

  if (command === "whoami") {
    return [
      { kind: "accent", text: profile.name },
      { kind: "output", text: `${profile.role} — ${profile.location}` },
      { kind: "output", text: profile.tagline },
    ]
  }

  if (command === "stack") {
    return stack.flatMap<Line>((group) => [
      { kind: "accent", text: group.label.toLowerCase() },
      { kind: "output", text: `  ${group.items.join(", ")}` },
    ])
  }

  if (command === "projects") {
    return projects.map<Line>((project) => ({
      kind: "output",
      text: `  ${project.name.padEnd(20)} ${project.language.padEnd(12)} ${project.repo}`,
    }))
  }

  if (command === "contact") {
    return [
      { kind: "output", text: `  email    ${profile.email}` },
      { kind: "output", text: `  github   ${profile.github}` },
      { kind: "output", text: `  web      ${profile.website}` },
    ]
  }

  if (command === "neofetch") {
    return [
      { kind: "accent", text: neofetch.user },
      { kind: "output", text: "-".repeat(neofetch.user.length) },
      ...neofetch.rows.map<Line>(([key, value]) => ({
        kind: "output",
        text: `${key.padEnd(10)} ${value}`,
      })),
    ]
  }

  if (command === "theme") {
    return [{ kind: "accent", text: `theme switched to ${toggleTheme()}` }]
  }

  if (command === "sudo" || command.startsWith("sudo ")) {
    return [{ kind: "error", text: "nice try." }]
  }

  return [
    {
      kind: "error",
      text: `command not found: ${command} — type 'help' for the list`,
    },
  ]
}

export function Terminal() {
  const [lines, setLines] = React.useState<Line[]>(WELCOME)
  const [value, setValue] = React.useState("")
  const [history, setHistory] = React.useState<string[]>([])
  const [historyIndex, setHistoryIndex] = React.useState(-1)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { resolvedTheme, setTheme } = useTheme()

  function toggleTheme() {
    const next = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(next)
    return next
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const entered = value
    const result = runCommand(entered, toggleTheme)
    setValue("")
    setHistoryIndex(-1)

    if (entered.trim()) setHistory((prev) => [entered, ...prev])

    if (result === "clear") {
      setLines([])
      return
    }

    setLines((prev) => [
      ...prev,
      { kind: "input", text: entered },
      ...result,
      { kind: "output", text: "" },
    ])
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return
    if (history.length === 0) return

    event.preventDefault()
    const next =
      event.key === "ArrowUp"
        ? Math.min(historyIndex + 1, history.length - 1)
        : Math.max(historyIndex - 1, -1)

    setHistoryIndex(next)
    setValue(next === -1 ? "" : history[next])
  }

  React.useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  return (
    <div className="terminal-dark soft-lg overflow-hidden rounded-2xl bg-card text-left ring-1 ring-white/15">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">
          {profile.handle} — zsh
        </span>
        <Badge
          variant="outline"
          className="ml-auto gap-1.5 border-white/15 px-2 text-[10px] text-muted-foreground"
        >
          <span className="size-1.5 rounded-full bg-acid" />
          live
        </Badge>
      </div>

      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="h-72 overflow-y-auto p-5 text-xs leading-relaxed sm:text-sm"
      >
        {lines.map((line, i) => (
          <p
            key={i}
            className={cn(
              "font-mono wrap-break-word whitespace-pre-wrap",
              line.kind === "output" && "text-muted-foreground",
              line.kind === "accent" && "font-semibold text-acid",
              line.kind === "error" && "text-hot"
            )}
          >
            {line.kind === "input" ? (
              <>
                <span className="text-acid">$ </span>
                <span className="text-foreground">{line.text}</span>
              </>
            ) : (
              line.text || " "
            )}
          </p>
        ))}

        <form onSubmit={submit} className="flex items-center gap-2">
          <label htmlFor="terminal-input" className="font-mono text-acid">
            $
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
            placeholder="type help"
            className="flex-1 bg-transparent font-mono text-foreground outline-none placeholder:text-muted-foreground/50"
          />
        </form>
      </div>
    </div>
  )
}
