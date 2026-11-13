import { bundledLanguages, codeToHtml } from 'shiki'
import { cn } from '@/lib/utils'
import { CopyButton } from './copy-button'

const THEMES = { light: 'github-light', dark: 'github-dark' } as const

type CodeBlockProps = {
  code: string
  language?: string
  lineNumbers?: boolean
  copyLabel: string
  copiedLabel: string
}

/** Highlighted at build time with Shiki; only the copy button ships JavaScript. */
export async function CodeBlock({ code, language = 'text', lineNumbers = false, copyLabel, copiedLabel }: CodeBlockProps) {
  const lang = language in bundledLanguages ? language : 'text'
  const html = await codeToHtml(code, { lang, themes: THEMES })

  return (
    <figure className="my-6 overflow-hidden rounded-lg border">
      <figcaption className="flex items-center justify-between border-b bg-subtle py-1 pr-1 pl-4">
        <span className="font-mono text-xs text-muted-foreground uppercase">{language}</span>
        <CopyButton code={code} copyLabel={copyLabel} copiedLabel={copiedLabel} />
      </figcaption>
      <div
        className={cn(
          'font-mono text-[13px] leading-6 sm:text-sm [&_pre]:max-h-[32rem] [&_pre]:overflow-auto [&_pre]:p-4 [&_pre]:[tab-size:4]',
          lineNumbers && 'code-line-numbers',
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  )
}
