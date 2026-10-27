import { useState, type FormEvent } from 'react'
import { submitContactRequest } from '../lib/contactApi'
import {
  initialContactValues,
  validateContact,
  type ContactFormErrors,
  type ContactFormValues,
} from '../lib/contactForm'

export type ContactStatus = 'idle' | 'submitting' | 'success' | 'error'

// Состояние формы заявки: значения, ошибки, статус отправки
export function useContactForm() {
  const [values, setValues] = useState<ContactFormValues>(initialContactValues)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [status, setStatus] = useState<ContactStatus>('idle')
  // Растёт после каждой успешной отправки; используется как key формы, чтобы очистить поля (в т.ч. файл)
  const [sentCount, setSentCount] = useState(0)

  const setField = <K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
    setStatus('idle')
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (status === 'submitting') return

    const nextErrors = validateContact(values)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setStatus('submitting')
    try {
      await submitContactRequest(values)
      setValues(initialContactValues)
      setSentCount((count) => count + 1)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return { values, errors, status, sentCount, setField, submit }
}
