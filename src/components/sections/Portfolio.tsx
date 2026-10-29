import { useSanityList } from '../../hooks/useSanityList'
import { FALLBACK_PROJECTS, fetchProjects, type Project } from '../../lib/portfolio'
import { Marquee } from '../ui/Marquee'

// Лента должна быть шире экрана: повторяем набор карточек, пока их не наберётся хотя бы столько
const MIN_CARDS = 8

// Картинки чередуются по высоте (358 / 390 в макете), карточки выровнены по нижнему краю
function Track({ projects }: { projects: Project[] }) {
  const cards = Array.from({ length: Math.ceil(MIN_CARDS / projects.length) }, () => projects).flat()

  return (
    <Marquee
      trackClassName="items-end"
      renderCopy={(copy) => (
        <ul aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-end gap-gap pr-gap">
          {cards.map(({ image, name, place, area }, i) => {
            const tall = (i % projects.length) % 2 === 1
            return (
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
                    <span className="whitespace-nowrap">{area} м²</span>
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    />
  )
}

export function Portfolio() {
  const projects = useSanityList(fetchProjects, FALLBACK_PROJECTS, 'portfolio')

  return (
    <section
      id="cases"
      className="flex w-full flex-col justify-between gap-block overflow-hidden bg-black py-section md:min-h-[min(100svh,calc(var(--spacing)*225))] md:pt-[calc(var(--header-h)+var(--spacing-gap))] md:pb-page"
    >
      <div className="mx-auto w-full max-w-[1920px] px-page">
        <h2 className="text-hero leading-none font-extrabold text-white">Кейсы</h2>
      </div>
      {projects && projects.length > 0 && <Track projects={projects} />}
    </section>
  )
}
