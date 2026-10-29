import { useId, useRef, type SelectHTMLAttributes } from 'react'
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
  const selectRef = useRef<HTMLSelectElement>(null)
  const empty = value === ''

  // Иконка тоже открывает список; с клавиатуры список открывается самим select
  const openList = () => {
    const select = selectRef.current
    if (!select) return
    select.focus()
    select.showPicker?.()
  }

  return (
    <Field
      id={selectId}
      label={label}
      helper={helper}
      error={error}
      className={className}
      rightIcon={
        <button type="button" tabIndex={-1} aria-hidden onClick={openList} className="cursor-pointer">
          <Icon icon={ChevronDown} className="text-field" />
        </button>
      }
    >
      <select
        ref={selectRef}
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
