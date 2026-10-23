import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helper?: string
  error?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

// Поле для тёмного фона. Состояния: inactive / focused / activated
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

  const border = disabled
    ? 'border-input-line'
    : error
      ? 'border-error'
      : 'border-input-line focus-within:border-white'
  const text = disabled
    ? 'text-input-line placeholder:text-input-line'
    : error
      ? 'text-error placeholder:text-error'
      : 'text-white placeholder:text-field'

  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className={`text-base leading-6 ${disabled ? 'text-input-line' : 'text-bg-2'}`}>
          {label}
        </label>
      )}
      <div
        className={`flex items-center gap-2 rounded-full border bg-input p-4 has-[input:focus:not(:placeholder-shown)]:shadow-[0_0_6px_rgba(255,255,255,0.25)] ${border} ${
          disabled ? 'text-input-line' : error ? 'text-error' : 'text-field'
        }`}
      >
        {leftIcon}
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={error || undefined}
          className={`min-w-0 flex-1 bg-transparent text-base leading-6 outline-none ${text}`}
          {...props}
        />
        {rightIcon}
      </div>
      {helper && (
        <p className={`text-sm leading-5 ${error && !disabled ? 'text-error' : 'text-body'}`}>
          {helper}
        </p>
      )}
    </div>
  )
}
