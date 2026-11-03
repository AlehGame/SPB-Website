import { useEffect, useRef, useState } from 'react'

// Становится true, когда элемент впервые приблизился к экрану (за rootMargin до него), и остаётся true.
// Нужен, чтобы тяжёлое содержимое (видео) не загружалось, пока пользователь до него не доскроллил.
export function useInViewOnce<T extends Element>(rootMargin = '600px 0px') {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setSeen(true)
        observer.disconnect()
      },
      { rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin])

  return [ref, seen] as const
}
