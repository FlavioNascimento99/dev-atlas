import { ExternalLink } from 'lucide-react'
import type { Reference } from '@/lib/content/types'
import type { Dictionary } from '@/lib/i18n/types'

export function ReferencesList({ references, typeLabels }: { references: Reference[]; typeLabels: Dictionary['referenceTypes'] }) {
  return (
    <ol className="flex list-decimal flex-col gap-3 pl-6 marker:text-muted-foreground">
      {references.map((reference) => (
        <li key={reference.url} className="pl-1">
          <a
            href={reference.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-baseline gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
          >
            {reference.title}
            <ExternalLink className="size-3.5 shrink-0 self-center" aria-hidden />
          </a>
          <span className="ml-2 text-xs text-muted-foreground">{typeLabels[reference.type]}</span>
        </li>
      ))}
    </ol>
  )
}
