import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Phone, X } from 'lucide'
import logoWhite from '../../assets/icons/logo-white.svg'
import { lockScroll } from '../../hooks/useSmoothScroll'
import { Icon } from '../ui/Icon'

interface MobileMenuProps {
  open: boolean
  links: readonly { label: string; href: string }[]
  onClose: () => void
}

// Форма панели в SVG 100×100: правый край R, левый L, у каждого края контрольная точка кривой (cl, cr).
// Вынос контрольной точки за край даёт изогнутый фронт «curve swipe».
interface Shape {
  L: number
  cl: number
  R: number
  cr: number
}

const pathOf = ({ L, cl, R, cr }: Shape) => `M${R} 0L${L} 0Q${cl} 50 ${L} 100L${R} 100Q${cr} 50 ${R} 0Z`

// Меню на весь экран: панель выезжает справа налево с изогнутым фронтом и так же уезжает налево при закрытии
export function MobileMenu({ open, links, onClose }: MobileMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const shape = useRef<Shape>({ L: 100, cl: 100, R: 100, cr: 100 })
  const wasOpened = useRef(false)

  useEffect(() => {
    // Пока меню ни разу не открывали, закрывать нечего
    if (!open && !wasOpened.current) return
    wasOpened.current = true
    const root = rootRef.current
    const path = pathRef.current
    const content = contentRef.current
    if (!root || !path || !content) return

    const s = shape.current
    const draw = () => path.setAttribute('d', pathOf(s))
    const items = content.children
    const tl = gsap.timeline({ onUpdate: draw })

    if (open) {
      Object.assign(s, { L: 100, cl: 100, R: 100, cr: 100 })
      tl.set(root, { autoAlpha: 1 })
        .set(items, { autoAlpha: 0, y: 24 })
        .to(s, { cl: 0, duration: 0.45, ease: 'power2.in' })
        .to(s, { L: 0, duration: 0.6, ease: 'power3.out' })
        .to(
          items,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power3.out',
          },
          '-=0.25',
        )
    } else {
      Object.assign(s, { L: 0, cl: 0, R: 100, cr: 100 })
      tl.to(items, { autoAlpha: 0, duration: 0.2, ease: 'power1.in' })
        .to(s, { cr: 0, duration: 0.45, ease: 'power2.in' })
        .to(s, { R: 0, duration: 0.6, ease: 'power3.out' })
        .set(root, { autoAlpha: 0 })
    }
    return () => {
      tl.kill()
    }
  }, [open])

  // Пока меню открыто, страница под ним не прокручивается; на широких экранах меню закрывается
  useEffect(() => {
    lockScroll(open)
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    const wide = window.matchMedia('(min-width: 768px)')
    const onWide = () => wide.matches && onClose()
    document.addEventListener('keydown', onKey)
    wide.addEventListener('change', onWide)
    return () => {
      document.removeEventListener('keydown', onKey)
      wide.removeEventListener('change', onWide)
      lockScroll(false)
    }
  }, [open, onClose])

  // Прокрутку нужно разблокировать до того, как глобальный обработчик якорей начнёт плавный скролл
  const closeFromLink = () => {
    lockScroll(false)
    onClose()
  }

  return (
    <div
      ref={rootRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Меню"
      aria-hidden={!open}
      inert={!open}
      className="invisible fixed inset-0 z-60 md:hidden"
    >
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <path ref={pathRef} d="M100 0L100 0Q100 50 100 100L100 100Q100 50 100 0Z" fill="#141414" />
      </svg>

      <button
        type="button"
        aria-label="Закрыть меню"
        onClick={onClose}
        className="absolute top-5.25 right-6.25 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full border border-white text-white"
      >
        <Icon icon={X} className="size-6" />
      </button>

      <div ref={contentRef} className="absolute inset-0 flex flex-col items-center px-page py-8 text-white">
        <div className="my-auto flex flex-col items-center gap-18">
          <img src={logoWhite} alt="Cool Print" width={85} height={51} className="h-12.75 w-21.25" />
          <nav className="flex w-56.25 flex-col gap-4">
            {links.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={closeFromLink}
                className="flex items-center justify-center rounded-full border border-white px-3 py-4 text-sm leading-6 font-medium transition-colors hover:bg-white hover:text-black"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        <a href="tel:+79213633647" className="flex items-center gap-2.5 px-4 py-2 text-sm leading-5">
          <Icon icon={Phone} className="size-4" />
          +7 9213633647
        </a>
        <p className="mt-3 text-sm leading-5">© Cool Print, печать на стенах · Санкт-Петербург</p>
      </div>
    </div>
  )
}
