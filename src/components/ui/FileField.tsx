import { useId } from 'react'
import { ACCEPT_ATTRIBUTE } from '../../lib/imageFormats'
import { Field, type FieldProps } from './Field'
import { controlBase } from './fieldClass'
import { UploadIcon } from './UploadIcon'

type FileFieldProps = Pick<FieldProps, 'label' | 'helper' | 'error' | 'className'> & {
  file: File | null
  placeholder: string
  onFileChange: (file: File | null) => void
  name?: string
}

// Выбор файла: сам input скрыт, кликабельна вся «таблетка» (label)
export function FileField({ label, helper, error = false, className, file, placeholder, onFileChange, name }: FileFieldProps) {
  const id = useId()

  return (
    <Field id={id} label={label} helper={helper} error={error} className={className}>
      <input
        id={id}
        name={name}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        aria-invalid={error || undefined}
        className="sr-only"
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
      />
      {/* Поверх контента, чтобы клик по любой части поля открывал выбор файла */}
      <label
        htmlFor={id}
        className={`${controlBase} flex cursor-pointer items-center gap-2 truncate ${
          error ? 'text-error' : file ? 'text-white' : 'text-field'
        }`}
      >
        <UploadIcon />
        <span className="truncate">{file ? file.name : placeholder}</span>
      </label>
    </Field>
  )
}
