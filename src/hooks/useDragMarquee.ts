import { useEffect, useRef } from 'react'

// Время, за которое лента проходит одну копию (раньше задавалось CSS-анимацией)
const LOOP_SECONDS = 120
// Сдвиг указателя в пикселях, после которого нажатие считается перетаскиванием, а не кликом
const DRAG_THRESHOLD = 5
// Скорость затухания инерции после отпускания (чем больше, тем быстрее остановка)
const FRICTION = 3
const MAX_VELOCITY = 3000

// Бесконечная лента: движется слева направо сама, паузится при наведении мыши (или paused),
// а ещё её можно перетаскивать мышью/пальцем — после отпускания лента катится по инерции.
// Внутри трека должны лежать две одинаковые копии: на сдвиге в одну копию лента возвращается без шва.
export function useDragMarquee(paused = false) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(paused)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let period = 0
    let x = 0
    let velocity = 0
    let hovered = false
    let pressed = false
    let dragging = false
    let suppressClick = false
    let startX = 0
    let lastX = 0
    let lastTime = 0
    let frameId = 0
    let prevFrame = 0

    const wrap = () => {
      if (period === 0) return
      x = ((x % period) - period) % period
    }

    const measure = () => {
      const first = period === 0
      period = track.scrollWidth / 2
      if (first) x = -period
      wrap()
    }

    const frame = (time: number) => {
      const dt = Math.min((time - prevFrame) / 1000, 0.05)
      prevFrame = time
      if (!dragging) {
        const auto = pausedRef.current || hovered || reduceMotion ? 0 : period / LOOP_SECONDS
        x += (auto + velocity) * dt
        velocity *= Math.exp(-FRICTION * dt)
        wrap()
      }
      track.style.transform = `translate3d(${x}px,0,0)`
      frameId = requestAnimationFrame(frame)
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      pressed = true
      startX = lastX = event.clientX
      lastTime = event.timeStamp
      velocity = 0
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!pressed) return
      if (!dragging) {
        if (Math.abs(event.clientX - startX) < DRAG_THRESHOLD) return
        dragging = true
        viewport.setPointerCapture(event.pointerId)
        viewport.dataset.dragging = ''
        lastX = event.clientX
        return
      }
      const dt = Math.max(event.timeStamp - lastTime, 1) / 1000
      const dx = event.clientX - lastX
      x += dx
      velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity * 0.5 + (dx / dt) * 0.5))
      wrap()
      lastX = event.clientX
      lastTime = event.timeStamp
    }

    const onPointerEnd = (event: PointerEvent) => {
      if (!pressed) return
      pressed = false
      if (!dragging) return
      dragging = false
      suppressClick = true
      setTimeout(() => (suppressClick = false), 0)
      delete viewport.dataset.dragging
      viewport.releasePointerCapture(event.pointerId)
      // Если перед отпусканием указатель стоял на месте, инерции нет
      if (event.timeStamp - lastTime > 100) velocity = 0
    }

    // После перетаскивания клик по карточке (например, по кнопке play) не должен срабатывать
    const onClickCapture = (event: MouseEvent) => {
      if (!suppressClick) return
      event.preventDefault()
      event.stopPropagation()
    }

    const onPointerEnter = (event: PointerEvent) => {
      hovered = event.pointerType === 'mouse'
    }
    const onPointerLeave = () => {
      hovered = false
    }

    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(track)
    frameId = requestAnimationFrame((time) => {
      prevFrame = time
      frameId = requestAnimationFrame(frame)
    })

    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('pointermove', onPointerMove)
    viewport.addEventListener('pointerup', onPointerEnd)
    viewport.addEventListener('pointercancel', onPointerEnd)
    viewport.addEventListener('click', onClickCapture, true)
    viewport.addEventListener('pointerenter', onPointerEnter)
    viewport.addEventListener('pointerleave', onPointerLeave)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('pointermove', onPointerMove)
      viewport.removeEventListener('pointerup', onPointerEnd)
      viewport.removeEventListener('pointercancel', onPointerEnd)
      viewport.removeEventListener('click', onClickCapture, true)
      viewport.removeEventListener('pointerenter', onPointerEnter)
      viewport.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return { viewportRef, trackRef }
}
