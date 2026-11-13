import { useId } from 'react'

type RangeParameterProps = {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}

export function RangeParameter({ label, value, min, max, onChange }: RangeParameterProps) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2 text-sm">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="font-mono font-semibold tabular-nums">
          {value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 w-full cursor-pointer accent-primary sm:h-6"
      />
    </div>
  )
}
