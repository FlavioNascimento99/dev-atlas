/** DevAtlas mark: a meridian globe drawn with SVG strokes. */
export function Logo({ className = 'size-8' }: { className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-md bg-primary text-primary-foreground ${className}`}>
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <circle cx="12" cy="12" r="8.5" />
        <ellipse cx="12" cy="12" rx="3.5" ry="8.5" />
        <path d="M3.5 12h17" />
      </svg>
    </span>
  )
}
