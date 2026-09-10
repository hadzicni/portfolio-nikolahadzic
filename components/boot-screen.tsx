"use client"

import * as React from "react"

import { bootLines } from "@/lib/content"

const LINE_DELAY = 150

/** Cached so the external-store snapshot stays stable across renders. */
let decision: boolean | null = null

function shouldBoot() {
  if (decision === null) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let seen = false
    try {
      seen = sessionStorage.getItem("booted") === "1"
    } catch {
      seen = false
    }
    decision = !reduced && !seen
  }
  return decision
}

const noopSubscribe = () => () => {}

/**
 * A short boot sequence on first load. It runs once per browser session and is
 * skipped for anyone who prefers reduced motion.
 */
export function BootScreen() {
  const enabled = React.useSyncExternalStore(
    noopSubscribe,
    shouldBoot,
    () => false
  )
  const [shown, setShown] = React.useState(0)
  const [leaving, setLeaving] = React.useState(false)
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    if (!enabled || done) return

    document.body.style.overflow = "hidden"
    const timers = bootLines.map((_, i) =>
      setTimeout(() => setShown(i + 1), LINE_DELAY * (i + 1))
    )

    const total = LINE_DELAY * (bootLines.length + 1)
    timers.push(setTimeout(() => setLeaving(true), total))
    timers.push(
      setTimeout(() => {
        document.body.style.overflow = ""
        try {
          sessionStorage.setItem("booted", "1")
        } catch {
          // Private mode: the boot simply replays next time.
        }
        setDone(true)
      }, total + 600)
    )

    return () => {
      timers.forEach(clearTimeout)
      document.body.style.overflow = ""
    }
  }, [enabled, done])

  if (!enabled || done) return null

  return (
    <div
      aria-hidden
      onClick={() => setLeaving(true)}
      className="fixed inset-0 z-100 flex items-center justify-center bg-background p-6 transition-opacity duration-500"
      style={{ opacity: leaving ? 0 : 1 }}
    >
      <div
        className="terminal-dark soft-lg w-full max-w-lg overflow-hidden rounded-2xl bg-card transition-all duration-500"
        style={{
          transform: leaving ? "scale(1.04)" : "scale(1)",
        }}
      >
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="min-h-56 p-5 font-mono text-xs leading-relaxed sm:text-sm">
          {bootLines.slice(0, shown).map((line) => (
            <p key={line} className="text-muted-foreground">
              <span className="text-acid">&rsaquo;</span> {line}
            </p>
          ))}
          <span className="mt-1 inline-block h-3.5 w-2 animate-blink bg-acid align-middle" />
        </div>
      </div>
    </div>
  )
}
