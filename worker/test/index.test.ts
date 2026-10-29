import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import worker, { type Env } from '../src/index.ts'

const env: Env = {
  SANITY_PROJECT_ID: 'proj',
  SANITY_DATASET: 'production',
  SANITY_WRITE_TOKEN: 'secret',
  ALLOWED_ORIGINS: 'https://site.example,http://localhost:5173',
}
const ORIGIN = 'https://site.example'
const realFetch = globalThis.fetch
afterEach(() => {
  globalThis.fetch = realFetch
})

const valid = {
  name: 'Анна',
  phone: '+7 (921) 363-36-47',
  buildingType: 'Школа',
  task: 'Стена в коридоре',
  source: 'x',
}

function post(payload: unknown, photo?: File, origin = ORIGIN) {
  const body = new FormData()
  body.append('document', JSON.stringify(payload))
  if (photo) body.append('wallPhoto', photo)
  return worker.fetch(new Request('https://worker.example', { method: 'POST', body, headers: { Origin: origin } }), env)
}

test('saves a request and uploads the photo', async () => {
  const calls: { url: string; init: RequestInit }[] = []
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url, init })
    const body = url.includes('/assets/images/') ? { document: { _id: 'image-abc' } } : {}
    return new Response(JSON.stringify(body), { status: 200 })
  }) as typeof fetch

  const response = await post(valid, new File([new Uint8Array([1, 2, 3])], 'wall.png', { type: 'image/png' }))
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), ORIGIN)
  assert.equal(calls.length, 2)
  assert.match(calls[0].url, /proj\.api\.sanity\.io\/v[\d-]+\/assets\/images\/production\?filename=wall\.png/)
  const mutation = JSON.parse(calls[1].init.body as string).mutations[0].create
  assert.equal(mutation._type, 'contactRequest')
  assert.equal(mutation.phone, '+79213633647')
  assert.equal(mutation.wallPhoto.asset._ref, 'image-abc')
  assert.equal(mutation.processed, false)
  assert.equal((calls[1].init.headers as Record<string, string>).Authorization, 'Bearer secret')
})

test('sends Telegram and email notifications when configured', async () => {
  const urls: string[] = []
  globalThis.fetch = (async (url: string) => {
    urls.push(url)
    return new Response(JSON.stringify({}), { status: 200 })
  }) as typeof fetch
  const pending: Promise<unknown>[] = []
  const notifyEnv: Env = {
    ...env,
    TELEGRAM_BOT_TOKEN: 'bot',
    TELEGRAM_CHAT_ID: '42',
    RESEND_API_KEY: 'key',
    NOTIFY_EMAIL: 'a@b.c',
  }
  const body = new FormData()
  body.append('document', JSON.stringify(valid))
  const request = new Request('https://worker.example', { method: 'POST', body, headers: { Origin: ORIGIN } })
  const response = await worker.fetch(request, notifyEnv, { waitUntil: (promise) => void pending.push(promise) })
  await Promise.all(pending)
  assert.equal(response.status, 200)
  assert.ok(urls.some((url) => url === 'https://api.telegram.org/botbot/sendMessage'))
  assert.ok(urls.some((url) => url === 'https://api.resend.com/emails'))
})

test('rejects invalid data without calling Sanity', async () => {
  globalThis.fetch = (async () => assert.fail('must not call Sanity')) as typeof fetch
  for (const bad of [
    { ...valid, name: 'А' },
    { ...valid, phone: '123' },
    { ...valid, buildingType: 'Космос' },
  ]) {
    assert.equal((await post(bad)).status, 400)
  }
  const gif = new File([new Uint8Array([1])], 'a.gif', { type: 'image/gif' })
  assert.equal((await post(valid, gif)).status, 400)
})

test('rejects foreign origins and handles preflight', async () => {
  globalThis.fetch = (async () => assert.fail('must not call Sanity')) as typeof fetch
  assert.equal((await post(valid, undefined, 'https://evil.example')).status, 403)
  const preflight = await worker.fetch(
    new Request('https://worker.example', { method: 'OPTIONS', headers: { Origin: ORIGIN } }),
    env,
  )
  assert.equal(preflight.status, 204)
  assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), ORIGIN)
})

test('returns 500 when Sanity fails', async () => {
  globalThis.fetch = (async () => new Response('nope', { status: 401 })) as typeof fetch
  assert.equal((await post(valid)).status, 500)
})
