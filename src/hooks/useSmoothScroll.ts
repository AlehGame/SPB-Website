import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const NAV_DURATION = 2
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)

let lenis: Lenis | null = null

// Плавная прокрутка к позиции или элементу (через Lenis, если он запущен)
function scrollTo(target: number | HTMLElement) {
  if (lenis) lenis.scrollTo(target, { duration: NAV_DURATION, easing: easeInOutCubic })
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' })
  else target.scrollIntoView({ behavior: 'smooth' })
}

export const scrollToTop = () => scrollTo(0)

// Секция с pin живёт внутри .pin-spacer — позиция считается по нему, иначе при скролле снизу будет сдвиг
function anchorTarget(hash: string) {
  if (hash === '#') return 0
  const section = document.getElementById(decodeURIComponent(hash.slice(1)))
  return section?.closest<HTMLElement>('.pin-spacer') ?? section
}

// Плавный скролл Lenis, синхронизированный с ScrollTrigger через тикер GSAP,
// плюс плавный переход по якорным ссылкам (#section)
export function useSmoothScroll() {
  useEffect(() => {
    const instance = new Lenis({ lerp: 0.06, wheelMultiplier: 0.85 })
    lenis = instance
    instance.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!link || event.defaultPrevented || link.hash === '#ui-kit') return
      const target = anchorTarget(link.hash)
      if (target === null) return
      event.preventDefault()
      scrollTo(target)
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(tick)
      instance.destroy()
      lenis = null
    }
  }, [])
}
