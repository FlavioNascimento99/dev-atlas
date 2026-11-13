'use client'

import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

const RESET_DELAY_MS = 2000

export function CopyButton({ code, copyLabel, copiedLabel }: { code: string; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), RESET_DELAY_MS)
    return () => clearTimeout(timeout)
  }, [copied])

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={copy} className="text-xs text-muted-foreground">
      {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
    </Button>
  )
}
