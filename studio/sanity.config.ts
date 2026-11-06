import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { requestTypes, siteTypes } from './schemaTypes'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'fy6hrt2t'

// Две рабочие области (переключатель в левом верхнем углу Studio):
// «Сайт» — публичный датасет (кейсы и отзывы), «Заявки» — закрытый датасет, чтобы имена и телефоны клиентов
// нельзя было прочитать через публичный API.
export default defineConfig([
  {
    name: 'site',
    title: 'Cool Print: сайт',
    basePath: '/site',
    projectId,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
    plugins: [structureTool()],
    schema: { types: siteTypes },
  },
  {
    name: 'requests',
    title: 'Cool Print: заявки',
    basePath: '/requests',
    projectId,
    dataset: process.env.SANITY_STUDIO_CONTACT_DATASET || 'private',
    plugins: [structureTool()],
    schema: { types: requestTypes },
  },
])
