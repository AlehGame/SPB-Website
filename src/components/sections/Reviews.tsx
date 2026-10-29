import { useEffect, useRef, useState } from 'react'
import { useSanityList } from '../../hooks/useSanityList'
import { FALLBACK_REVIEWS, fetchReviews, type Review } from '../../lib/reviews'
import { Marquee } from '../ui/Marquee'
import { PlayIcon } from '../ui/PlayIcon'

// Лента должна быть шире экрана: повторяем набор видео, пока их не наберётся хотя бы столько
const MIN_CARDS = 6

interface VideoCardProps {
  src: string
  title?: string
  active: boolean
  hidden: boolean
  onToggle: () => void
  onEnded: () => void
}

// Превью: чёрно-белое, без звука, зациклено. Активная карточка: цвет, звук и с самого начала.
function VideoCard({ src, title, active, hidden, onToggle, onEnded }: VideoCardProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (active) {
      video.muted = false
      video.loop = false
      video.currentTime = 0
    } else {
      video.muted = true
      video.loop = true
    }
    video.play().catch(() => {})
  }, [active])

  return (
    <li className="group/card relative h-147 w-80 shrink-0 overflow-hidden md:h-122 md:w-96 rounded-card bg-black">
      <video
        ref={ref}
        src={src}
        className={`size-full object-cover transition-[filter] duration-300 ${
          active ? '' : 'grayscale group-hover/card:grayscale-0'
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onEnded={onEnded}
      />
      <button
        type="button"
        tabIndex={hidden ? -1 : 0}
        aria-label={`${active ? 'Остановить видео-отзыв' : 'Смотреть видео-отзыв со звуком'}${title ? `: ${title}` : ''}`}
        onClick={onToggle}
        className="absolute inset-0 flex cursor-pointer items-center justify-center text-white outline-none"
      >
        <PlayIcon
          className={`size-16 transition-opacity duration-300 group-focus-within/card:opacity-100 group-hover/card:opacity-100 [@media(hover:none)]:opacity-100 ${
            active ? 'hidden' : 'opacity-0'
          }`}
        />
      </button>
    </li>
  )
}

// Лента на паузе, пока видео играет со звуком
function Track({ reviews }: { reviews: Review[] }) {
  const items = Array.from({ length: Math.ceil(MIN_CARDS / reviews.length) }, () => reviews).flat()
  const [activeId, setActiveId] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  // Если секция ушла с экрана, звук выключаем
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setActiveId(null)
    })
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={rootRef}>
      <Marquee
        paused={activeId !== null}
        renderCopy={(copy) => (
          <ul aria-hidden={copy === 1 || undefined} className="flex shrink-0 gap-gap pr-gap">
            {items.map(({ video, title }, i) => {
              const id = `${copy}-${i}`
              return (
                <VideoCard
                  key={id}
                  src={video}
                  title={title}
                  active={activeId === id}
                  hidden={copy === 1}
                  onToggle={() => setActiveId(activeId === id ? null : id)}
                  onEnded={() => setActiveId(null)}
                />
              )
            })}
          </ul>
        )}
      />
    </div>
  )
}

export function Reviews() {
  const reviews = useSanityList(fetchReviews, FALLBACK_REVIEWS, 'reviews')

  return (
    <section id="reviews" className="flex w-full flex-col gap-block overflow-hidden bg-bg-1 py-section">
      <div className="mx-auto w-full max-w-[1920px] px-page">
        <h2 className="text-hero leading-none font-extrabold text-black">Клиенты говорят</h2>
      </div>
      {reviews && reviews.length > 0 && <Track reviews={reviews} />}
    </section>
  )
}
