import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { HEIGHT_RANGE, WIDTH_RANGE } from '../../lib/pricing'

// Пропорции стены-заглушки (макет 712 × 560), пока фото не загружено
const DEFAULT_WALL_RATIO = 712 / 560

// Шаг сдвига изображения стрелками, доля свободного места
const KEY_STEP = 0.05

// Доля стены, которую занимает изображение: от 20% (минимум на ползунке) до 100% (максимум)
const printScale = (value: number, { min, max }: { min: number; max: number }) =>
  0.2 + (0.8 * (value - min)) / (max - min)

const clamp = (value: number) => Math.min(1, Math.max(0, value))

interface WallPreviewProps {
  width: number
  height: number
  wallUrl: string | null
  printUrl: string | null
}

interface Drag {
  startX: number
  startY: number
  from: { x: number; y: number }
}

/**
 * Визуализатор. «Wall image» — неподвижный фон: блок повторяет пропорции загруженного фото стены и целиком
 * вписывается в область (единицы контейнера cqw/cqh), без обрезки и искажений. «Image for wall» — слой
 * с изображением для печати: его размер задают ползунки, а положение на стене выбирается перетаскиванием
 * (или стрелками, когда слой в фокусе).
 */
export function WallPreview({ width, height, wallUrl, printUrl }: WallPreviewProps) {
  const wallRef = useRef<HTMLDivElement>(null)
  const drag = useRef<Drag | null>(null)
  const [dragging, setDragging] = useState(false)
  // Положение слоя: доля свободного места на стене (0 — слева/сверху, 1 — справа/снизу)
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 })
  const [loaded, setLoaded] = useState<{ url: string; ratio: number } | null>(null)

  const ratio = loaded && loaded.url === wallUrl ? loaded.ratio : DEFAULT_WALL_RATIO
  const scaleX = printScale(width, WIDTH_RANGE)
  const scaleY = printScale(height, HEIGHT_RANGE)
  const movable = scaleX < 1 || scaleY < 1

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!movable || event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { startX: event.clientX, startY: event.clientY, from: position }
    setDragging(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current
    const wall = wallRef.current
    if (!start || !wall) return
    const rect = wall.getBoundingClientRect()
    const freeX = rect.width * (1 - scaleX)
    const freeY = rect.height * (1 - scaleY)
    setPosition({
      x: freeX > 0 ? clamp(start.from.x + (event.clientX - start.startX) / freeX) : start.from.x,
      y: freeY > 0 ? clamp(start.from.y + (event.clientY - start.startY) / freeY) : start.from.y,
    })
  }

  const endDrag = () => {
    drag.current = null
    setDragging(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key]
    if (!step || !movable) return
    event.preventDefault()
    setPosition(({ x, y }) => ({ x: clamp(x + step[0] * KEY_STEP), y: clamp(y + step[1] * KEY_STEP) }))
  }

  return (
    <div className="relative min-h-0 w-full flex-1 overflow-hidden bg-bg-1 md:aspect-[712/560] md:min-h-64 lg:aspect-auto [container-type:size]">
      <div
        ref={wallRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-bg-2"
        style={{ aspectRatio: ratio, width: `min(100cqw, calc(100cqh * ${ratio}))` }}
      >
        {wallUrl && (
          <img
            src={wallUrl}
            alt="Фото вашей стены"
            className="absolute inset-0 size-full select-none"
            draggable={false}
            onLoad={({ currentTarget: { naturalWidth, naturalHeight } }) =>
              setLoaded({ url: wallUrl, ratio: naturalWidth / naturalHeight })
            }
          />
        )}
        <div
          role="group"
          tabIndex={movable ? 0 : -1}
          aria-label="Изображение для печати: перетащите или сдвиньте стрелками"
          className={`absolute touch-none outline-offset-2 focus-visible:outline-2 focus-visible:outline-black ${
            movable ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''
          } ${dragging ? '' : 'transition-[width,height,left,top] duration-150 ease-out'}`}
          style={{
            width: `${scaleX * 100}%`,
            height: `${scaleY * 100}%`,
            left: `${position.x * (1 - scaleX) * 100}%`,
            top: `${position.y * (1 - scaleY) * 100}%`,
            touchAction: movable ? 'none' : 'auto',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
        >
          {printUrl ? (
            <img
              src={printUrl}
              alt="Изображение для печати"
              className="size-full object-contain select-none"
              draggable={false}
            />
          ) : (
            <div className="flex size-full items-center justify-center border border-dashed border-line bg-bg-2/80 p-2 text-center text-sm text-body">
              Изображение для печати
            </div>
          )}
        </div>
      </div>
      {printUrl && movable && (
        <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs whitespace-nowrap text-white">
          Перетащите изображение, чтобы выбрать место
        </p>
      )}
    </div>
  )
}
