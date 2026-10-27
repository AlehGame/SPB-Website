import { useId, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide'
import { Field, type FieldProps } from './Field'
import { controlBase } from './fieldClass'
import { Icon } from './Icon'

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> &
  Pick<FieldProps, 'label' | 'helper' | 'error'> & {
    options: readonly string[]
    placeholder: string
    onValueChange: (value: string) => void
  }

// Выпадающий список (нативный select: доступен с клавиатуры и на мобильных)
export function SelectField({
  label,
  helper,
  error = false,
  options,
  placeholder,
  value,
  onValueChange,
  className = '',
  id,
  ...props
}: SelectFieldProps) {
  const autoId = useId()
  const selectId = id ?? autoId
  const empty = value === ''

  return (
    <Field
      id={selectId}
      label={label}
      helper={helper}
      error={error}
      className={className}
      rightIcon={<Icon icon={ChevronDown} className="pointer-events-none text-field" />}
    >
      <select
        id={selectId}
        value={value}
        aria-invalid={error || undefined}
        onChange={(event) => onValueChange(event.target.value)}
        className={`${controlBase} cursor-pointer appearance-none ${
          error ? 'text-error' : empty ? 'text-field' : 'text-white'
        }`}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-input text-white">
            {option}
          </option>
        ))}
      </select>
    </Field>
  )
}
