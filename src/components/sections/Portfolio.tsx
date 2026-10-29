import project1 from'../../assets/images/project-1.webp'
import project2 from '../../assets/images/project-2.webp'
import project3 from '../../assets/images/project-3.webp'
import project4 from '../../assets/images/project-4.webp'
import project5 from '../../assets/images/project-5.webp'
import { Marquee } from '../ui/Marquee'

// Картинки чередуются по высоте (358 / 390 в макете), карточки выровнены по нижнему краю
const projects = [
  { image: project1, tall: false, name: 'Коридор школы', place: 'Санкт-Петербург', area: '25.5 м²' },
  { image: project2, tall: true, name: 'Игровая в детском саду', place: 'Москва', area: '40.5 м²' },
  { image: project3, tall: false, name: 'Школа искусств', place: 'Псков', area: '18.3 м²' },
  { image: project4, tall: true, name: 'Кафе', place: 'Мурманск', area: '40.5 м²' },
  { image: project5, tall: false, name: 'Ресторан', place: 'Санкт-Петербург', area: '18.3 м²' },
]

// Сколько раз повторяем набор карточек внутри одной копии, чтобы она была шире экрана
const REPEATS = 2

const cards = Array.from({ length: REPEATS }, () => projects).flat()

function Track() {
  return (
    <Marquee
      trackClassName="items-end"
      renderCopy={(copy) => (
        <ul aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-end gap-gap pr-gap">
          {cards.map(({ image, tall, name, place, area }, i) => (
            <li key={i} className="flex w-70.75 shrink-0 flex-col gap-4">
              <img
                src={image}
                alt={copy === 0 ? name : ''}
                width={283}
                height={tall ? 390 : 358}
                draggable={false}
                className={`w-full object-cover ${tall ? 'h-143 md:h-97.5' : 'h-131.25 md:h-89.5'}`}
              />
              <div className="flex flex-col gap-2">
                <h3 className="text-sm leading-6 font-extrabold tracking-[0.05em] text-white uppercase">{name}</h3>
                <p className="flex items-center justify-between gap-2 text-xs leading-4 text-line">
                  <span>{place}</span>
                  <span className="whitespace-nowrap">{area}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    />
  )
}

export function Portfolio() {
  return (
    <section
      id="cases"
      className="flex w-full md:min-h-[min(100svh,calc(var(--spacing)*225))] flex-col justify-between gap-block overflow-hidden bg-black py-section md:pt-[calc(var(--header-h)+var(--spacing-gap))] md:pb-page"
    >
      <div className="mx-auto w-full max-w-[1920px] px-page">
        <h2 className="text-hero leading-none font-extrabold text-white">Кейсы</h2>
      </div>
      <Track />
    </section>
  )
}
