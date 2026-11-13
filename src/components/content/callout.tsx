import { CircleAlert, Info, Lightbulb, TriangleAlert, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { CalloutType } from './types'

const STYLES: Record<CalloutType, { icon: LucideIcon; className: string }> = {
  info: { icon: Info, className: 'border-l-info [&_svg]:text-info' },
  tip: { icon: Lightbulb, className: 'border-l-success [&_svg]:text-success' },
  warning: { icon: TriangleAlert, className: 'border-l-warning [&_svg]:text-warning' },
  important: { icon: CircleAlert, className: 'border-l-brand [&_svg]:text-brand' },
}

type CalloutProps = {
  type?: CalloutType
  label: string
  children: ReactNode
}

export function Callout({ type = 'info', label, children }: CalloutProps) {
  const { icon: Icon, className } = STYLES[type]
  return (
    <aside role="note" className={cn('my-6 flex gap-3 rounded-lg border border-l-4 bg-subtle p-4', className)}>
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div className="min-w-0 [&>p]:my-0">
        <p className="mb-1 font-semibold">{label}</p>
        {children}
      </div>
    </aside>
  )
}
