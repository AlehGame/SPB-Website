import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

// Шаг сдвига изображения стрелками, доля свободного места
const KEY_STEP = 0.05

// Область визуализатора условно показывает стену 10 × 3 м (независимо от диапазона ползунков):
// изображение занимает ту же долю области, что выбранный размер — от стены. Больше стены — на всю область.
const REFERENCE_WALL = { width: 10, height: 3 }

const printScale = (value: number, reference: number) => Math.min(1, value / reference)

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
 * Визуализатор по макету. Слой «Wall image» — белая карточка (#FAFAFA) с отступом 40: в неё целиком
 * загружается фото стены. Слой «image for wall» — область внутри карточки: в ней лежит изображение для печати,
 * его размер задают ползунки, а положение выбирается перетаскиванием (или стрелками, когда слой в фокусе).
 */
export function WallPreview({ width, height, wallUrl, printUrl }: WallPreviewProps) {
  const areaRef = useRef<HTMLDivElement>(null)
  const drag = useRef<Drag | null>(null)
  const [dragging, setDragging] = useState(false)
  // Положение слоя: доля свободного места в области (0 — слева/сверху, 1 — справа/снизу)
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 })

  const scaleX = printScale(width, REFERENCE_WALL.width)
  const scaleY = printScale(height, REFERENCE_WALL.height)
  const movable = scaleX < 1 || scaleY < 1

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!movable || event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { startX: event.clientX, startY: event.clientY, from: position }
    setDragging(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current
    const area = areaRef.current
    if (!start || !area) return
    const rect = area.getBoundingClientRect()
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
    // Wall image
    <div className="relative flex flex-col overflow-hidden rounded-card bg-white p-10 max-md:aspect-[361/291] md:aspect-[792/640] md:p-page lg:aspect-auto">
      {wallUrl && (
        <img
          src={wallUrl}
          alt="Фото вашей стены"
          className="absolute inset-0 size-full object-cover select-none"
          draggable={false}
        />
      )}
      {/* Image for wall */}
      <div ref={areaRef} className={`relative min-h-0 w-full flex-1 ${wallUrl ? '' : 'bg-bg-1'}`}>
        <div
          role="group"
          tabIndex={movable ? 0 : -1}
          aria-label="Изображение для печати: перетащите или сдвиньте стрелками"
          className={`absolute outline-offset-2 focus-visible:outline-2 focus-visible:outline-black ${
            movable ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''
          } ${dragging ? '' : 'transition-[width,height,left,top] duration-150 ease-out'}`}
          style={{
            width: `${scaleX * 100}%`,
            height: `${scaleY * 100}%`,
            left: `${position.x * (1 - scaleX) * 100}%`,
            top: `${position.y * (1 - scaleY) * 100}%`,
            // На телефоне жест по слою двигает его; когда двигать нечего, страница скроллится как обычно
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
        {printUrl && movable && (
          <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs whitespace-nowrap text-white">
            Перетащите изображение, чтобы выбрать место
          </p>
        )}
      </div>
    </div>
  )
}
