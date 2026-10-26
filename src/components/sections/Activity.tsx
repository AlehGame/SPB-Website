import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import image1 from '../../assets/images/activity-1.webp'
import image2 from '../../assets/images/activity-2.webp'
import image3 from '../../assets/images/activity-3.webp'

gsap.registerPlugin(ScrollTrigger)

// Радиальный «циферблатный» wipe: открывается сектор от направления «вниз» против часовой стрелки.
// Угол сектора задаёт CSS-переменная --a (0deg — слой скрыт, 360deg — открыт полностью).
const wipeMask =
  'conic-gradient(from 180deg at 50% 50%, transparent calc(360deg - var(--a, 0deg)), #000 calc(360deg - var(--a, 0deg)))'

const maskStyle = { WebkitMaskImage: wipeMask, maskImage: wipeMask }

// Один заголовок = одна «страница» текста внутри окна-маски
const titles = [
  {
    lines: ['Школы,', 'Детские сады,', 'Институты,', 'Поликлинники'],
    description:
      'Школы получают дизайн-проект, бизнес получает точный цвет бренда, квартиры получают любую картинку дешевле фотообоев.',
  },
  { lines: ['Офисы,', 'Кафе,', 'Рестораны'] },
  { lines: ['Частные', 'дома'] },
]

export function Activity() {
  const sectionRef = useRef<HTMLElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const maskRefs = useRef<(HTMLDivElement | null)[]>([])
  const titleRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const win = windowRef.current
    if (!section || !win) return

    const ctx = gsap.context(() => {
      const [maskB, maskC] = maskRefs.current
      const [t1, t2, t3] = titleRefs.current
      if (!maskB || !maskC || !t1 || !t2 || !t3) return

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * 4}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Прозрачные 0.3 в начале и в конце — «удержание» первого и последнего кадра
      const HOLD = 0.3
      const wipe = (mask: HTMLElement, start: number) => {
        const state = { a: 0 }
        tl.to(
          state,
          {
            a: 360,
            duration: 1,
            ease: 'power1.inOut',
            onUpdate: () => mask.style.setProperty('--a', `${state.a}deg`),
          },
          start,
        )
      }
      // Уходящий заголовок поднимается вверх за верхний край окна,
      // входящий поднимается снизу из-за нижнего края
      const exit = (el: HTMLElement, start: number) =>
        tl.to(el, { y: () => -win.offsetHeight, duration: 0.6 }, start)
      const enter = (el: HTMLElement, start: number) =>
        tl.fromTo(el, { y: () => el.offsetHeight }, { y: 0, duration: 0.45 }, start)

      // Этап 1: фото 1 → фото 2, заголовок 1 → заголовок 2
      wipe(maskB, HOLD)
      exit(t1, HOLD)
      enter(t2, HOLD + 0.55)

      // Этап 2: фото 2 → фото 3, заголовок 2 → заголовок 3
      wipe(maskC, HOLD + 1)
      exit(t2, HOLD + 1)
      enter(t3, HOLD + 1.55)

      tl.to({}, { duration: HOLD }, HOLD + 2)
    }, section)

    return () => ctx.revert()
  }, [])

  const overlay = <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

  return (
    <section ref={sectionRef} id="audience" className="relative h-svh w-full overflow-hidden bg-black">
      {/* Фон секции на всю ширину экрана: фото 1 внизу, фото 2 и 3 открываются поверх радиальной маской */}
      <div className="absolute inset-0">
        <img src={image1} alt="" className="size-full object-cover" />
        {overlay}
      </div>
      {[image2, image3].map((src, i) => (
        <div
          key={src}
          ref={(el) => {
            maskRefs.current[i] = el
          }}
          className="absolute inset-0"
          style={maskStyle}
        >
          <img src={src} alt="" className="size-full object-cover" />
          {overlay}
        </div>
      ))}

      {/* Контент ограничен 1920px */}
      <div className="relative mx-auto h-full max-w-[1920px]">
        <p className="absolute top-[calc(var(--header-h)+var(--spacing-gap))] left-page text-base leading-6 font-extrabold text-white uppercase">
          Для кого
        </p>

        {/* Окно-маска: заголовки скользят внутри и обрезаются по краям */}
        <div
          ref={windowRef}
          className="absolute inset-x-page bottom-page h-[4.25em] overflow-hidden text-hero leading-none font-bold text-white"
        >
          {titles.map(({ lines, description }, i) => (
            <div
              key={lines[0]}
              ref={(el) => {
                titleRefs.current[i] = el
              }}
              className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-gap-lg"
            >
              <h2 className="font-bold">
                {lines.map((line) => (
                  <span key={line} className="block whitespace-nowrap">
                    {line}
                  </span>
                ))}
              </h2>
              {description && (
                <p className="hidden max-w-97 text-base leading-6 font-normal text-white md:block">
                  {description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
