import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { CategoryIcon } from '@/components/content/category-icon'
import type { CategoryIconName } from '@/components/navigation/types'

type DomainCardProps = {
  href: string
  icon: CategoryIconName
  name: string
  description: string
  countLabel: string
}

export function DomainCard({ href, icon, name, description, countLabel }: DomainCardProps) {
  return (
    <article className="group relative flex h-full flex-col gap-3 rounded-lg border bg-card p-5 transition-colors hover:border-brand/60 hover:bg-subtle">
      <span className="grid size-10 place-items-center rounded-md border bg-subtle text-brand">
        <CategoryIcon name={icon} className="size-5" />
      </span>
      <h3 className="font-semibold tracking-tight">
        <Link href={href} className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-ring">
          {name}
        </Link>
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <p className="mt-auto flex items-center justify-between pt-2 text-xs font-medium text-muted-foreground">
        {countLabel}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </p>
    </article>
  )
}
