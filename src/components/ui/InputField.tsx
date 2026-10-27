import { useId, type InputHTMLAttributes } from 'react'
import { Field, type FieldProps } from './Field'
import { controlBase, fieldTone } from './fieldClass'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> &
  Pick<FieldProps, 'label' | 'helper' | 'error' | 'leftIcon' | 'rightIcon'>

// Текстовое поле. Состояния: inactive / focused / activated
// (фокус + введён текст, со свечением) / error / disabled
export function InputField({
  label,
  helper,
  error = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}: InputFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <Field
      id={inputId}
      label={label}
      helper={helper}
      error={error}
      disabled={disabled}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      className={className}
    >
      <input
        id={inputId}
        disabled={disabled}
        aria-invalid={error || undefined}
        className={`${controlBase} ${fieldTone(error, disabled).control}`}
        {...props}
      />
    </Field>
  )
}
