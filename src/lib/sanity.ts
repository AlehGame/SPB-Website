// Project ID не секрет; значение по умолчанию страхует от пустой переменной окружения при сборке
const projectId: string = import.meta.env.VITE_SANITY_PROJECT_ID || 'fy6hrt2t'
const dataset: string = import.meta.env.VITE_SANITY_DATASET || 'production'
const API_VERSION = '2025-01-01'

export const isSanityConfigured = Boolean(projectId)

// Публичная GROQ-выборка через CDN Sanity; токен не нужен, датасет должен быть публичным
export async function sanityQuery<T>(query: string, signal?: AbortSignal): Promise<T> {
  const url = `https://${projectId}.apicdn.sanity.io/v${API_VERSION}/data/query/${dataset}?query=${encodeURIComponent(query)}`
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`Sanity: ${response.status}`)
  const { result } = (await response.json()) as { result: T }
  return result
}
