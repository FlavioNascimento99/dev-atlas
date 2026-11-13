import { useId, type ReactNode } from 'react'

type LabSvgProps = {
  width: number
  height: number
  title: string
  description: string
  children: ReactNode
}

/** Accessible, responsive SVG canvas: scales to the lab width and exposes a title and description to screen readers. */
export function LabSvg({ width, height, title, description, children }: LabSvgProps) {
  const titleId = useId()
  const descriptionId = useId()
  return (
    <svg
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
      viewBox={`0 0 ${width} ${height}`}
      className="mx-auto block h-auto w-full max-w-2xl text-[11px] select-none"
    >
      <title id={titleId}>{title}</title>
      <desc id={descriptionId}>{description}</desc>
      {children}
    </svg>
  )
}
