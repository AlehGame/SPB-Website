import { useEffect, useRef, useState } from 'react'
import review1 from '../../assets/video/review-1.mp4'
import review2 from '../../assets/video/review-2.mp4'
import review3 from '../../assets/video/review-3.mp4'
import { PlayIcon } from '../ui/PlayIcon'

const videos = [review1, review2, review3]

// Сколько раз повторяем набор видео внутри одной копии, чтобы она была шире экрана
const REPEATS = 3

interface VideoCardProps {
  src: string
  active: boolean
  hidden: boolean
  onToggle: () => void
  onEnded: () => void
}

// Превью: чёрно-белое, без звука, зациклено. Активная карточка: цвет, звук и с самого начала.
function VideoCard({ src, active, hidden, onToggle, onEnded }: VideoCardProps) {
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
    <li className="group/card relative h-122 w-96 shrink-0 overflow-hidden rounded-card bg-black">
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
        aria-label={active ? 'Остановить видео-отзыв' : 'Смотреть видео-отзыв со звуком'}
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

// Лента идёт слева направо; пауза при наведении на видео и пока видео играет со звуком
function Track() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const items = Array.from({ length: REPEATS }, () => videos).flat()

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
    <div ref={rootRef} className="flex w-full overflow-hidden">
      {/* Две одинаковые копии: на -50% трек возвращается в исходную точку — цикл без шва */}
      <div
        data-playing={activeId !== null || undefined}
        className="flex w-max shrink-0 animate-slow-scroll will-change-transform has-[li:hover]:[animation-play-state:paused] data-playing:[animation-play-state:paused]"
      >
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 gap-gap pr-gap">
            {items.map((src, i) => {
              const id = `${copy}-${i}`
              return (
                <VideoCard
                  key={id}
                  src={src}
                  active={activeId === id}
                  hidden={copy === 1}
                  onToggle={() => setActiveId(activeId === id ? null : id)}
                  onEnded={() => setActiveId(null)}
                />
              )
            })}
          </ul>
        ))}
      </div>
    </div>
  )
}

export function Reviews() {
  return (
    <section id="reviews" className="flex w-full flex-col gap-block overflow-hidden bg-bg-1 py-section">
      <div className="mx-auto w-full max-w-[1920px] px-page">
        <h2 className="text-hero leading-none font-extrabold text-black">Клиенты говорят</h2>
      </div>
      <Track />
    </section>
  )
}
