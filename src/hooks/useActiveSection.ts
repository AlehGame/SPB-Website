import { useEffect, useState } from 'react'

// id секции, которая сейчас пересекает середину окна (null — ни одна из списка)
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) setActive(target.id)
          else setActive((current) => (current === target.id ? null : current))
        })
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [ids])

  return active
}
