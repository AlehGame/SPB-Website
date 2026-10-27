import type { ReactNode } from 'react'
import { useDragMarquee } from '../../hooks/useDragMarquee'

interface MarqueeProps {
  paused?: boolean
  // Рисует одну копию содержимого; вторая нужна для бесшовного цикла и скрыта от скринридеров
  renderCopy: (copy: 0 | 1) => ReactNode
  trackClassName?: string
}

// Лента на всю ширину: идёт сама слева направо, паузится при наведении, перетаскивается мышью
export function Marquee({ paused, renderCopy, trackClassName = '' }: MarqueeProps) {
  const { viewportRef, trackRef } = useDragMarquee(paused)

  return (
    <div
      ref={viewportRef}
      className="flex w-full cursor-grab touch-pan-y overflow-hidden select-none data-dragging:cursor-grabbing"
    >
      <div ref={trackRef} className={`flex w-max shrink-0 will-change-transform ${trackClassName}`}>
        {renderCopy(0)}
        {renderCopy(1)}
      </div>
    </div>
  )
}
