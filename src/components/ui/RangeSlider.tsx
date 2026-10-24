import { useId } from 'react'

interface RangeSliderProps {
  label: string
  valueText: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
}

export function RangeSlider({ label, valueText, min, max, step, value, onChange }: RangeSliderProps) {
  const id = useId()
  const progress = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-black">
        {label}
      </label>
      <output htmlFor={id} className="text-sm font-bold text-black">
        {valueText}
      </output>
      <input
        id={id}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ '--p': `${progress}%` } as React.CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  )
}
