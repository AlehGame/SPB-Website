/**
 * Загружает в Sanity пять стартовых проектов с картинками из src/assets/images.
 * Запуск (после `npx sanity login`), из папки studio/:
 *   npx sanity exec scripts/seed.ts --with-user-token
 * Повторный запуск обновляет те же документы, дубликатов не создаёт.
 */
import { createReadStream } from 'node:fs'
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2025-01-01' })

const projects = [
  { file: 'project-1.webp', title: 'Коридор школы', location: 'Санкт-Петербург', area: 25.5 },
  { file: 'project-2.webp', title: 'Игровая в детском саду', location: 'Москва', area: 40.5 },
  { file: 'project-3.webp', title: 'Школа искусств', location: 'Псков', area: 18.3 },
  { file: 'project-4.webp', title: 'Кафе', location: 'Мурманск', area: 40.5 },
  { file: 'project-5.webp', title: 'Ресторан', location: 'Санкт-Петербург', area: 18.3 },
]

for (const [index, { file, title, location, area }] of projects.entries()) {
  const asset = await client.assets.upload('image', createReadStream(`../src/assets/images/${file}`), {
    filename: file,
  })
  await client.createOrReplace({
    _id: `seed-project-${index + 1}`,
    _type: 'project',
    title,
    location,
    area,
    order: index + 1,
    image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
  })
  console.log(`✓ ${title}`)
}
