import * as React from "react"

import { Button } from "@/components/ui/button"

type LinkButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "render" | "nativeButton"
> & {
  href: string
  /** Opens the link in a new tab with safe rel attributes. */
  external?: boolean
}

/**
 * A Button that renders an anchor. Base UI needs `nativeButton={false}` here,
 * otherwise it warns about the lost native button semantics.
 */
export function LinkButton({
  href,
  external,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Button
      nativeButton={false}
      render={
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        />
      }
      {...props}
    >
      {children}
    </Button>
  )
}
