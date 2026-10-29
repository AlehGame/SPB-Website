import { toSanityDocument, type ContactFormValues } from './contactForm'

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

  const body = new FormData()
  body.append('document', JSON.stringify(toSanityDocument(values)))
  if (values.wallPhoto) body.append('wallPhoto', values.wallPhoto)

  if (!endpoint) {
    if (import.meta.env.DEV) console.info('[contact] VITE_CONTACT_ENDPOINT не задан, заявка не отправлена', toSanityDocument(values))
    await new Promise((resolve) => setTimeout(resolve, 800))
    return
  }

  const response = await fetch(endpoint, { method: 'POST', body })
  if (!response.ok) throw new Error(`Не удалось отправить заявку (${response.status})`)
}
