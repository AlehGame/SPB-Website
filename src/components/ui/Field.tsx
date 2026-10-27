import type { ReactNode } from 'react'
import { fieldTone } from './fieldClass'

export interface FieldProps {
  id: string
  label?: string
  helper?: string
  error?: boolean
  disabled?: boolean
  /** Многострочное поле: иконки и текст выравниваются по верху */
  multiline?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  className?: string
  children: ReactNode
}

// Оболочка поля для тёмного фона: подпись, рамка, иконки, подсказка/ошибка.
// Сам элемент ввода (input, select, textarea, file) передаётся как children.
export function Field({
  id,
  label,
  helper,
  error = false,
  disabled = false,
  multiline = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
}: FieldProps) {
  const tone = fieldTone(error, disabled)

  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className={`text-base leading-6 ${tone.label}`}>
          {label}
        </label>
      )}
      <div
        className={`flex gap-2 rounded-full border bg-input p-4 has-[input:focus:not(:placeholder-shown),textarea:focus:not(:placeholder-shown)]:shadow-[0_0_6px_rgba(255,255,255,0.25)] ${
          multiline ? 'items-start' : 'items-center'
        } ${tone.shell}`}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </div>
      {helper && <p className={`text-sm leading-5 ${error && !disabled ? 'text-error' : 'text-body'}`}>{helper}</p>}
    </div>
  )
}
