import step1 from '../../assets/images/how-1.webp'
import step2 from '../../assets/images/how-2.webp'
import step3 from '../../assets/images/how-3.webp'
import step4 from '../../assets/images/how-4.webp'
import step5 from '../../assets/images/how-5.webp'
import { useDragScroll } from '../../hooks/useDragScroll'

const steps = [
  {
    image: step1,
    bg: 'bg-lilac',
    title: 'Фото и размеры стен',
    text: 'Присылайте фото стены и её размеры, после чего мы рассчитаем для вас актуальную стоимость. Для школ выезжаем на замер.',
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
    title: 'Установка принтера в помещении',
    text: 'Оборудование заносят в помещение, собирают и печатают. Мебель и пол закрывают, стену готовить не нужно. Габариты Ш 1.5м x В 2м.',
  },
  {
    image: step4,
    bg: 'bg-sky',
    title: 'Печать изображения на стену',
    text: 'Принтер наносит изображение слой за слоем, краска сохнет под УФ-лампой. Скорость нанесения 1,5–6 м²/ч, высота до 3 м за проход.',
  },
  {
    image: step5,
    bg: 'bg-bg-1',
    title: 'Доработка нашим художником',
    text: 'Художник закрывает технические отступы у углов стены, пола и потолка, куда не достает принтер и добавляет авторские детали.',
  },
]

// Обычная карусель: листается колесом, пальцем и зажатой кнопкой мыши
export function HowItWorks() {
  const listRef = useDragScroll()

  return (
    <section id="how-it-works" className="flex w-full flex-col gap-14 bg-white py-section md:gap-17.5 md:pb-page">
      <h2 className="px-gutter text-hero leading-none font-extrabold text-black">Как это происходит</h2>

      <div
        ref={listRef}
        className="flex cursor-grab gap-gap overflow-x-auto px-gutter select-none [scrollbar-width:none] data-dragging:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {steps.map(({ image, bg, title, text }, i) => (
          <article
            key={title}
            className={`flex w-90 shrink-0 flex-col gap-gap rounded-card p-6 md:w-[min(88vw,calc(var(--spacing)*147))] md:p-card ${bg}`}
          >
            <p className="text-base leading-6 font-extrabold text-body uppercase">Шаг {i + 1}.</p>
            <img
              src={image}
              alt=""
              draggable={false}
              className="aspect-[524/402] w-full object-contain"
            />
            <h3 className="text-2xl leading-8 font-extrabold text-black md:leading-6">{title}</h3>
            <p className="text-base leading-6 text-body">{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
