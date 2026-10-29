import { useEffect, useState } from 'react'
import { FALLBACK_PROJECTS, fetchProjects, isSanityConfigured, type Project } from '../lib/portfolio'

// Проекты из Sanity; null, пока идёт загрузка. Без настройки Sanity или при ошибке — запасной набор.
export function usePortfolioProjects() {
  const [projects, setProjects] = useState<Project[] | null>(isSanityConfigured ? null : FALLBACK_PROJECTS)

  useEffect(() => {
    if (!isSanityConfigured) return
    const controller = new AbortController()
    fetchProjects(controller.signal)
      .then(setProjects)
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        console.error('[portfolio] не удалось загрузить проекты из Sanity', error)
        setProjects(FALLBACK_PROJECTS)
      })
    return () => controller.abort()
  }, [])

  return projects
}
