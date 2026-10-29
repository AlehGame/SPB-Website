import { useEffect, useRef } from 'react'

// Сдвиг указателя в пикселях, после которого нажатие считается перетаскиванием, а не кликом
const DRAG_THRESHOLD = 5

// Горизонтальная прокрутка контейнера зажатой кнопкой мыши.
// Пальцем и колесом контейнер и так прокручивается нативно (overflow-x-auto).
export function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let pressed = false
    let dragging = false
    let startX = 0
    let startScroll = 0

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      pressed = true
      startX = event.clientX
      startScroll = el.scrollLeft
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!pressed) return
      const dx = event.clientX - startX
      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return
        dragging = true
        el.setPointerCapture(event.pointerId)
        el.dataset.dragging = ''
      }
      el.scrollLeft = startScroll - dx
    }

    const onPointerEnd = (event: PointerEvent) => {
      if (!pressed) return
      pressed = false
      if (!dragging) return
      el.releasePointerCapture(event.pointerId)
      delete el.dataset.dragging
      // Клик, которым закончилось перетаскивание, не должен сработать на ссылке или кнопке
      const swallowClick = (clickEvent: MouseEvent) => clickEvent.stopPropagation()
      el.addEventListener('click', swallowClick, { capture: true, once: true })
      setTimeout(() => {
        dragging = false
        el.removeEventListener('click', swallowClick, true)
      }, 0)
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerEnd)
    el.addEventListener('pointercancel', onPointerEnd)
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerEnd)
      el.removeEventListener('pointercancel', onPointerEnd)
    }
  }, [])

  return ref
}
