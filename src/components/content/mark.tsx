'use client'

import { useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { annotate } from 'rough-notation'

type MarkVariant = 'highlight' | 'underline'
type MarkTone = 'brand' | 'teal' | 'amber'

const TONE_TOKENS: Record<MarkTone, string> = {
  brand: '--brand',
  teal: '--highlight',
  amber: '--warning',
}

// Highlight sits behind the text, so it stays faint enough for AA contrast in both themes.
const VARIANT_ALPHA: Record<MarkVariant, number> = { highlight: 0.25, underline: 0.85 }

/** Turns a #rrggbb token into #rrggbbaa; SVG attributes can't resolve var() or color-mix(). */
export function withAlpha(hex: string, alpha: number): string {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex
  const channel = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
  return `${hex}${channel.toString(16).padStart(2, '0')}`
}

type MarkProps = {
  variant?: MarkVariant
  tone?: MarkTone
  children: ReactNode
}

/** Hand-drawn emphasis for key ideas; without JS it is plain inline text. */
export function Mark({ variant = 'highlight', tone = 'teal', children }: MarkProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!inView || !element) return

    const root = document.documentElement
    const color = () =>
      withAlpha(getComputedStyle(root).getPropertyValue(TONE_TOKENS[tone]).trim(), VARIANT_ALPHA[variant])

    const annotation = annotate(element, {
      type: variant,
      color: color(),
      animate: !reduceMotion,
      animationDuration: 700,
      strokeWidth: variant === 'underline' ? 2 : 1.5,
      padding: variant === 'underline' ? 1 : 2,
      iterations: 2,
      multiline: true,
    })
    annotation.show()

    // show() on a visible annotation redraws without animating, so skip the initial
    // notification every observer emits, or the entry animation would be cut short.
    let initial = true
    const resizeObserver = new ResizeObserver(() => {
      if (initial) initial = false
      else annotation.show()
    })
    resizeObserver.observe(element)
    resizeObserver.observe(document.body)

    // The color setter redraws only when the token value actually changed.
    const themeObserver = new MutationObserver(() => {
      annotation.color = color()
    })
    themeObserver.observe(root, { attributes: true, attributeFilter: ['class'] })

    return () => {
      resizeObserver.disconnect()
      themeObserver.disconnect()
      annotation.remove()
    }
  }, [inView, variant, tone, reduceMotion])

  return (
    <span ref={ref} className="relative">
      {children}
    </span>
  )
}
