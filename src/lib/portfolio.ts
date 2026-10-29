import project1 from '../assets/images/project-1.webp'
import project2 from '../assets/images/project-2.webp'
import project3 from '../assets/images/project-3.webp'
import project4 from '../assets/images/project-4.webp'
import project5 from '../assets/images/project-5.webp'

export interface Project {
  id: string
  image: string
  name: string
  place: string
  /** Квадратура в м² */
  area: number
}

// Показываются, пока Sanity не подключён (нет VITE_SANITY_PROJECT_ID) или недоступен
export const FALLBACK_PROJECTS: Project[] = [
  { id: '1', image: project1, name: 'Коридор школы', place: 'Санкт-Петербург', area: 25.5 },
  { id: '2', image: project2, name: 'Игровая в детском саду', place: 'Москва', area: 40.5 },
  { id: '3', image: project3, name: 'Школа искусств', place: 'Псков', area: 18.3 },
  { id: '4', image: project4, name: 'Кафе', place: 'Мурманск', area: 40.5 },
  { id: '5', image: project5, name: 'Ресторан', place: 'Санкт-Петербург', area: 18.3 },
]

const projectId: string | undefined = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset: string = import.meta.env.VITE_SANITY_DATASET || 'production'
const API_VERSION = '2025-01-01'

// Ширина картинки с запасом под retina: карточка 283px
const IMAGE_PARAMS = '?w=600&auto=format'

// Сначала проекты с заданным порядком, остальные — новые первыми
const QUERY = `*[_type == "project" && defined(image.asset)] | order(coalesce(order, 999999) asc, _createdAt desc) {
  _id, title, location, area, "image": image.asset->url
}`

interface SanityProject {
  _id: string
  title: string
  location: string
  area: number
  image: string
}

export const isSanityConfigured = Boolean(projectId)

// Публичная выборка через CDN Sanity; токен не нужен, датасет должен быть публичным
export async function fetchProjects(signal?: AbortSignal): Promise<Project[]> {
  const url = `https://${projectId}.apicdn.sanity.io/v${API_VERSION}/data/query/${dataset}?query=${encodeURIComponent(QUERY)}`
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`Sanity: ${response.status}`)
  const { result } = (await response.json()) as { result: SanityProject[] }
  return result.map(({ _id, title, location, area, image }) => ({
    id: _id,
    image: image + IMAGE_PARAMS,
    name: title,
    place: location,
    area,
  }))
}
