import { toSanityDocument, type ContactFormValues } from './contactForm'
import { prepareWallPhoto } from './prepareWallPhoto'

const REQUEST_TIMEOUT_MS = 30_000

/**
 * Отправка заявки на Cloudflare Worker (папка worker/), который сохраняет её в Sanity.
 * Токен записи Sanity нельзя хранить в браузере, поэтому форма шлёт данные на свой endpoint,
 * адрес задаётся переменной VITE_CONTACT_ENDPOINT (см. README).
 *
 * Пока endpoint не задан, отправка имитируется, а данные выводятся в консоль (только в dev).
 */
const endpoint: string | undefined = import.meta.env.VITE_CONTACT_ENDPOINT

export async function submitContactRequest(values: ContactFormValues): Promise<void> {
  // Honeypot: бот заполнил скрытое поле — делаем вид, что всё отправлено
  if (values.website) return

  const payload = toSanityDocument(values)
  if (!endpoint) {
    if (import.meta.env.DEV) console.info('[contact] VITE_CONTACT_ENDPOINT не задан, заявка не отправлена', payload)
    await new Promise((resolve) => setTimeout(resolve, 800))
    return
  }

  const body = new FormData()
  body.append('document', JSON.stringify(payload))
  if (values.wallPhoto) body.append('wallPhoto', await prepareWallPhoto(values.wallPhoto))

  // Без таймаута при плохой связи кнопка «Отправляем…» могла бы висеть бесконечно
  const response = await fetch(endpoint, { method: 'POST', body, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
  if (!response.ok) throw new Error(`Не удалось отправить заявку (${response.status})`)
}
