import { useEffect, useState } from 'react'
import { FALLBACK_PROJECTS, fetchProjects, isSanityConfigured, type Project } from '../lib/portfolio'

// Проекты из Sanity; null, пока идёт загрузка. Без настройки Sanity, при ошибке или пока в Sanity нет проектов — запасной набор.
export function usePortfolioProjects() {
  const [projects, setProjects] = useState<Project[] | null>(isSanityConfigured ? null : FALLBACK_PROJECTS)

  useEffect(() => {
    if (!isSanityConfigured) return
    const controller = new AbortController()
    fetchProjects(controller.signal)
      .then((items) => setProjects(items.length > 0 ? items : FALLBACK_PROJECTS))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        console.error('[portfolio] не удалось загрузить проекты из Sanity', error)
        setProjects(FALLBACK_PROJECTS)
      })
    return () => controller.abort()
  }, [])

  return projects
}
