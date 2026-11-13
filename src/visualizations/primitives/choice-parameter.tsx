import { useId } from 'react'

type ChoiceParameterProps<Value extends string> = {
  label: string
  value: Value
  options: { value: Value; label: string }[]
  onChange: (value: Value) => void
}

/** Segmented radio group: native radios keep arrow-key navigation and screen reader semantics. */
export function ChoiceParameter<Value extends string>({ label, value, options, onChange }: ChoiceParameterProps<Value>) {
  const name = useId()
  return (
    <fieldset className="flex min-w-0 flex-col gap-1">
      <legend className="mb-1 text-sm">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <label
            key={option.value}
            className="inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border bg-background px-3 text-sm has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring sm:h-9 sm:min-w-9"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
