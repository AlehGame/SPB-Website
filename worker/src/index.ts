/**
 * Cloudflare Worker: принимает заявку с формы сайта и сохраняет её в Sanity.
 *
 * Токен записи Sanity хранится только здесь (секрет SANITY_WRITE_TOKEN), в браузер он не попадает.
 * Запрос: multipart/form-data с полями
 *   document  — JSON с полями заявки (name, phone, buildingType, task, source)
 *   wallPhoto — необязательное фото стены (png, jpeg, webp, до 10 МБ)
 * Дополнительно, если заданы RESEND_API_KEY и NOTIFY_EMAIL, отправляет уведомление на почту.
 */

export interface Env {
  SANITY_PROJECT_ID: string
  SANITY_DATASET: string
  SANITY_WRITE_TOKEN: string
  /** Адреса сайта через запятую; запросы с других адресов отклоняются */
  ALLOWED_ORIGINS: string
  RESEND_API_KEY?: string
  NOTIFY_EMAIL?: string
}

const API_VERSION = '2025-01-01'
const BUILDING_TYPES = ['Школа', 'Школа искусств', 'Детский сад', 'Кафе', 'Ресторан', 'Офис', 'Частный дом', 'Другое']
const PHOTO_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_PHOTO_SIZE = 10 * 1024 * 1024
const MAX_TASK_LENGTH = 2000

interface ContactPayload {
  name: string
  phone: string
  buildingType: string
  task: string
  source: string
}

const json = (body: unknown, status: number, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } })

// Повторная проверка на сервере: браузерной валидации доверять нельзя
function parsePayload(raw: unknown): ContactPayload | string {
  if (typeof raw !== 'object' || raw === null) return 'Некорректные данные'
  const { name, phone, buildingType, task, source } = raw as Record<string, unknown>
  if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100) return 'Укажите имя'
  const digits = typeof phone === 'string' ? phone.replace(/\D/g, '') : ''
  if (digits.length < 10 || digits.length > 15) return 'Укажите корректный телефон'
  if (typeof buildingType !== 'string' || !BUILDING_TYPES.includes(buildingType)) return 'Выберите вариант из списка'
  if (task !== undefined && (typeof task !== 'string' || task.length > MAX_TASK_LENGTH))
    return 'Слишком длинное описание'
  return {
    name: name.trim(),
    phone: `+${digits}`,
    buildingType,
    task: typeof task === 'string' ? task.trim() : '',
    source: typeof source === 'string' ? source.slice(0, 300) : '',
  }
}

async function sanityFetch(env: Env, path: string, init: RequestInit) {
  const response = await fetch(`https://${env.SANITY_PROJECT_ID}.api.sanity.io/v${API_VERSION}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${env.SANITY_WRITE_TOKEN}`, ...init.headers },
  })
  if (!response.ok) throw new Error(`Sanity ${path}: ${response.status} ${await response.text()}`)
  return (await response.json()) as { document?: { _id: string } }
}

async function notifyByEmail(env: Env, payload: ContactPayload, hasPhoto: boolean) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_EMAIL) return
  const text = [
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Кто: ${payload.buildingType}`,
    `Задача: ${payload.task || '—'}`,
    `Фото стены: ${hasPhoto ? 'приложено (смотрите в Studio)' : 'нет'}`,
  ].join('\n')
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Cool Print <onboarding@resend.dev>',
      to: [env.NOTIFY_EMAIL],
      subject: `Новая заявка с сайта: ${payload.name}`,
      text,
    }),
  })
  if (!response.ok) console.error('Resend:', response.status, await response.text())
}

export default {
  async fetch(request: Request, env: Env, ctx?: { waitUntil(promise: Promise<unknown>): void }): Promise<Response> {
    const origin = request.headers.get('Origin') ?? ''
    const allowed = env.ALLOWED_ORIGINS.split(',').map((item) => item.trim())
    const cors: Record<string, string> = allowed.includes(origin)
      ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' }
      : {}

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: { ...cors, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Max-Age': '86400' },
      })
    }
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors)
    if (!allowed.includes(origin)) return json({ error: 'Forbidden' }, 403)

    try {
      const form = await request.formData()
      const rawDocument = form.get('document')
      const payload = parsePayload(typeof rawDocument === 'string' ? JSON.parse(rawDocument) : null)
      if (typeof payload === 'string') return json({ error: payload }, 400, cors)

      const photo = form.get('wallPhoto')
      const file = photo instanceof File && photo.size > 0 ? photo : null
      if (file && (!PHOTO_TYPES.includes(file.type) || file.size > MAX_PHOTO_SIZE)) {
        return json({ error: 'Фото: png, jpeg или webp до 10 МБ' }, 400, cors)
      }

      let wallPhoto: unknown
      if (file) {
        const { document } = await sanityFetch(
          env,
          `/assets/images/${env.SANITY_DATASET}?filename=${encodeURIComponent(file.name || 'wall-photo')}`,
          { method: 'POST', headers: { 'Content-Type': file.type }, body: await file.arrayBuffer() },
        )
        wallPhoto = { _type: 'image', asset: { _type: 'reference', _ref: document?._id } }
      }

      await sanityFetch(env, `/data/mutate/${env.SANITY_DATASET}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mutations: [
            {
              create: {
                _type: 'contactRequest',
                ...payload,
                ...(wallPhoto ? { wallPhoto } : {}),
                processed: false,
                submittedAt: new Date().toISOString(),
              },
            },
          ],
        }),
      })

      const notification = notifyByEmail(env, payload, Boolean(file)).catch((error) => console.error(error))
      ctx?.waitUntil(notification)
      return json({ ok: true }, 200, cors)
    } catch (error) {
      console.error(error)
      return json({ error: 'Не удалось сохранить заявку' }, 500, cors)
    }
  },
}
