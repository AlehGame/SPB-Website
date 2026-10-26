import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import step1 from '../../assets/images/how-1.webp'
import step2 from '../../assets/images/how-2.webp'
import step3 from '../../assets/images/how-3.webp'
import step4 from '../../assets/images/how-4.webp'
import step5 from '../../assets/images/how-5.webp'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    image: step1,
    bg: 'bg-lilac',
    title: 'Фото и размеры стен',
    text: 'Присылаете фото и размеры, мы считаем стоимость. Для школ выезжаем на замер.',
  },
  {
    image: step2,
    bg: 'bg-mint',
    title: 'Дизайн проект и визуализация',
    text: 'Графические дизайнеры готовят макет по пожеланиям. Картинка может быть из интернета, из нейросети или готовым логотипом.',
  },
  {
    image: step3,
    bg: 'bg-sand',
    title: 'Установка принтера',
    text: 'Оборудование заносят в помещение, собирают и печатают. Мебель и пол закрывают, стену готовить не нужно. Габариты Ш 1.5м x В 2м.',
  },
  {
    image: step4,
    bg: 'bg-sky',
    title: 'Печать изображения',
    text: 'Слой за слоем, краска сохнет сразу под УФ-лампой. Скорость 1,5–6 м²/ч, высота до 3 м за проход.',
  },
  {
    image: step5,
    bg: 'bg-white',
    title: 'Доработка художником',
    text: 'Художник закрывает технические отступы у углов, пола и потолка и добавляет авторские детали.',
  },
]

// Секция на весь экран закрепляется, а вертикальный скролл двигает ленту карточек горизонтально
export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    // Насколько нужно сдвинуть ленту, чтобы последняя карточка дошла до правого края
    const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth)

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="flex h-svh w-full flex-col gap-u70 overflow-hidden bg-bg-1 pt-[calc(72px+var(--spacing-u24))] pb-u40"
    >
      <h2 className="px-u40 text-step leading-6 font-extrabold text-black uppercase">Как это происходит</h2>

      <ul ref={trackRef} className="flex min-h-0 w-max flex-1 gap-u24 px-u40 will-change-transform">
        {steps.map(({ image, bg, title, text }, i) => (
          <li
            key={title}
            className={`flex aspect-[588/634] h-full max-w-[88vw] shrink-0 flex-col gap-u24 rounded-u24 p-u32 ${bg}`}
          >
            <p className="text-step leading-6 font-extrabold text-body uppercase">Шаг {i + 1}.</p>
            <img src={image} alt="" className="min-h-0 w-full flex-1 object-contain" />
            <h3 className="text-step-title leading-[1.1] font-extrabold text-black">{title}</h3>
            <p className="text-step leading-6 text-body">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
