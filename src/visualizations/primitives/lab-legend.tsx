import { cn } from '@/lib/utils'

type LabLegendProps = {
  /** `swatch` holds the token classes of the color sample, e.g. `border-success bg-success/20`. */
  items: { label: string; swatch: string }[]
}

/** Color key shown under a drawing. It is HTML instead of SVG so the entries wrap on narrow screens. */
export function LabLegend({ items }: LabLegendProps) {
  return (
    <div className="mx-auto mt-3 flex max-w-2xl flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <span aria-hidden className={cn('size-3 shrink-0 rounded-sm border', item.swatch)} />
          {item.label}
        </span>
      ))}
    </div>
  )
}
