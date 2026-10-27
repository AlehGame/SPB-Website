import { useId, type TextareaHTMLAttributes } from 'react'
import { Field, type FieldProps } from './Field'
import { controlBase, fieldTone } from './fieldClass'

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & Pick<FieldProps, 'label' | 'helper' | 'error'>

// Многострочное поле
export function TextareaField({
  label,
  helper,
  error = false,
  className = '',
  id,
  rows = 3,
  ...props
}: TextareaFieldProps) {
  const autoId = useId()
  const textareaId = id ?? autoId

  return (
    <Field id={textareaId} label={label} helper={helper} error={error} multiline className={className}>
      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={error || undefined}
        className={`${controlBase} resize-none ${fieldTone(error, false).control}`}
        {...props}
      />
    </Field>
  )
}
