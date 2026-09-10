import { cn } from "cn"

/**
 * A slow scrolling band of keywords. Items are rendered twice so the animation
 * can translate by exactly -50% and loop without a visible seam.
 */
export function Marquee({
  items,
  reverse,
  duration = 50,
  className,
  separator = "•",
}: {
  items: readonly string[]
  reverse?: boolean
  duration?: number
  className?: string
  separator?: string
}) {
  const doubled = [...items, ...items]

  return (
    <div
      className={cn("flex overflow-hidden select-none", className)}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
      aria-hidden
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-8 pr-8 whitespace-nowrap",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="label flex items-center gap-8">
            {item}
            <span className="text-acid-ink">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
