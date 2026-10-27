import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

// Плавная прокрутка в самое начало страницы (через Lenis, если он запущен)
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.6 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Плавный скролл Lenis, синхронизированный с ScrollTrigger через тикер GSAP
export function useSmoothScroll() {
  useEffect(() => {
    const instance = new Lenis()
    lenis = instance
    instance.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      lenis = null
    }
  }, [])
}
