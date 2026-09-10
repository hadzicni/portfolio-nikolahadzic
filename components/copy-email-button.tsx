"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = React.useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      toast.success("Copied to clipboard", { description: email })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy — please select the address manually")
    }
  }

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={copy}
      aria-label={`Copy ${email}`}
      className="h-11 rounded-full px-6 text-sm"
    >
      {copied ? (
        <CheckIcon data-icon="inline-start" />
      ) : (
        <CopyIcon data-icon="inline-start" />
      )}
      {copied ? "Copied" : "Copy address"}
    </Button>
  )
}
