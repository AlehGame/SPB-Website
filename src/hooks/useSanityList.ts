import { useEffect, useState } from 'react'
import { isSanityConfigured } from '../lib/sanity'

// Список из Sanity; null, пока идёт загрузка.
// Без настройки Sanity, при ошибке или пока в Sanity ничего нет — запасной набор.
export function useSanityList<T>(fetchItems: (signal: AbortSignal) => Promise<T[]>, fallback: T[], name: string) {
  const [items, setItems] = useState<T[] | null>(isSanityConfigured ? null : fallback)

  useEffect(() => {
    if (!isSanityConfigured) return
    const controller = new AbortController()
    fetchItems(controller.signal)
      .then((result) => setItems(result.length > 0 ? result : fallback))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        console.error(`[${name}] не удалось загрузить данные из Sanity`, error)
        setItems(fallback)
      })
    return () => controller.abort()
  }, [fetchItems, fallback, name])

  return items
}
