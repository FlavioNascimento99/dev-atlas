'use client'

import { format } from '@/lib/i18n/dictionary'
import type { Locale } from '@/lib/i18n/types'
import { useLocale } from '@/lib/i18n/use-locale'
import { LabLegend } from '../../primitives/lab-legend'
import { LabSvg } from '../../primitives/lab-svg'
import { VisualLab } from '../../visual-lab'
import { CONTAINER_STACK, VM_STACK } from './stacks'
import { texts } from './texts'
import type { LayerKind, Stack } from './types'

const WIDTH = 240
const GAP = 5
const UNITS_TOP = 36
const UNIT = { gap: 6, padding: 5, label: 16 }
const LAYER_HEIGHT: Record<LayerKind, number> = {
  hardware: 24,
  hypervisor: 24,
  hostOs: 38,
  runtime: 24,
  guestOs: 38,
  libs: 22,
  app: 24,
}
const NEUTRAL = 'fill-surface stroke-border'
const LAYER_TONE: Record<LayerKind, string> = {
  hardware: NEUTRAL,
  hypervisor: NEUTRAL,
  runtime: NEUTRAL,
  hostOs: 'fill-highlight/20 stroke-highlight',
  guestOs: 'fill-highlight/20 stroke-highlight',
  libs: 'fill-info/20 stroke-info',
  app: 'fill-brand/20 stroke-brand',
}

type Texts = (typeof texts)[Locale]

/** Layers arrive bottom to top and are drawn top to bottom, starting at `top`. Returns the rows and where they end. */
function stackRows(layers: LayerKind[], top: number) {
  let y = top
  const rows = [...layers].reverse().map((kind) => {
    const row = { kind, y }
    y += LAYER_HEIGHT[kind] + GAP
    return row
  })
  return { rows, bottom: y }
}

function Layer({ kind, x, y, width, t }: { kind: LayerKind; x: number; y: number; width: number; t: Texts }) {
  const note = kind === 'hostOs' || kind === 'guestOs' ? t.kernelNotes[kind] : null
  return (
    <g>
      <rect x={x} y={y} width={width} height={LAYER_HEIGHT[kind]} rx={4} className={LAYER_TONE[kind]} />
      <text x={x + width / 2} y={y + (note ? 15 : LAYER_HEIGHT[kind] / 2 + 4)} textAnchor="middle" className="fill-foreground font-semibold">
        {t.layers[kind]}
      </text>
      {note && (
        <text x={x + width / 2} y={y + 29} textAnchor="middle" className="fill-foreground text-[10.5px]">
          {note}
        </text>
      )}
    </g>
  )
}

function StackSvg({ stack, t }: { stack: Stack; t: Texts }) {
  const labels = t.stacks[stack.id]
  const unitWidth = (WIDTH - 2 - (stack.units - 1) * UNIT.gap) / stack.units
  const inner = stackRows(stack.unit, UNITS_TOP + UNIT.label)
  const unitHeight = inner.bottom - UNITS_TOP
  const shared = stackRows(stack.shared, UNITS_TOP + unitHeight + GAP)

  return (
    <LabSvg width={WIDTH} height={shared.bottom - GAP + 1} title={labels.svgTitle} description={labels.svgDescription}>
      <text x={WIDTH / 2} y={13} textAnchor="middle" className="fill-foreground text-[12px] font-bold">
        {labels.title}
      </text>
      <text x={WIDTH / 2} y={28} textAnchor="middle" className="fill-muted-foreground text-[10.5px]">
        {labels.note}
      </text>
      {Array.from({ length: stack.units }, (_, unit) => {
        const x = 1 + unit * (unitWidth + UNIT.gap)
        return (
          <g key={unit}>
            <rect
              x={x}
              y={UNITS_TOP}
              width={unitWidth}
              height={unitHeight}
              rx={6}
              strokeWidth={1.5}
              strokeDasharray="5 3"
              className="fill-background stroke-primary"
            />
            <text x={x + unitWidth / 2} y={UNITS_TOP + 12} textAnchor="middle" className="fill-foreground text-[10.5px]">
              {format(labels.unit, { n: unit + 1 })}
            </text>
            {inner.rows.map((row) => (
              <Layer key={row.kind} kind={row.kind} x={x + UNIT.padding} y={row.y} width={unitWidth - 2 * UNIT.padding} t={t} />
            ))}
          </g>
        )
      })}
      {shared.rows.map((row) => (
        <Layer key={row.kind} kind={row.kind} x={1} y={row.y} width={WIDTH - 2} t={t} />
      ))}
    </LabSvg>
  )
}

/** Type A diagram: the layers under an application in a virtual machine and in a container, side by side. */
export function VmVsContainers() {
  const t = texts[useLocale()]
  return (
    <VisualLab title={t.title} description={t.description} fidelity="conceptual" explanation={t.explanation}>
      <div className="mx-auto grid max-w-sm items-end gap-6 sm:max-w-2xl sm:grid-cols-2">
        <StackSvg stack={VM_STACK} t={t} />
        <StackSvg stack={CONTAINER_STACK} t={t} />
      </div>
      <LabLegend
        items={[
          { label: t.legend.kernel, swatch: 'border-highlight bg-highlight/20' },
          { label: t.legend.app, swatch: 'border-brand bg-brand/20' },
          { label: t.legend.libs, swatch: 'border-info bg-info/20' },
          { label: t.legend.boundary, swatch: 'border-dashed border-primary' },
        ]}
      />
    </VisualLab>
  )
}
