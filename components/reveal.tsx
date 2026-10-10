"use client"

import * as React from "react"

/**
 * Fades and lifts its children in. By default that happens once they scroll
 * into view, which needs JavaScript to notice; this only flips the data
 * attribute and the animation itself lives in CSS.
 *
 * `trigger="load"` plays the same entrance straight away, in CSS alone. Use it
 * for what is on screen from the start, so first paint never waits on the
 * bundle.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
  trigger = "scroll",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  as?: React.ElementType
  trigger?: "scroll" | "load"
}) {
  const ref = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const node = ref.current
    if (!node || trigger === "load") return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        node.dataset.reveal = "shown"
        observer.disconnect()
      },
      { rootMargin: "0px 0px -10% 0px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [trigger])

  return (
    <Tag
      ref={ref}
      data-reveal={trigger}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
      className={className}
    >
      {children}
    </Tag>
  )
}
