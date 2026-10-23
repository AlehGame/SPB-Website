import { useEffect, useRef } from 'react'

/**
 * Сплошной слой цвета поверх изображения. Под курсором «выбиваются» квадратные
 * пиксели (digital pixel mask) и открывают картинку под слоем; после ухода
 * курсора пиксели случайно гаснут. Слушает указатель на родительском элементе.
 */
export function PixelMask({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !host || !ctx) return

    const color =
      getComputedStyle(document.documentElement).getPropertyValue('--color-bg-2').trim() || '#e9e7e1'

    let width = 0
    let height = 0
    let cell = 20
    let cols = 0
    let rows = 0
    let intensity = new Float32Array(0) // 0..1: насколько «открыта» ячейка
    let threshold = new Float32Array(0) // случайный порог ячейки — даёт пиксельный дизеринг
    let raf = 0
    let last = 0
    let pointer: { x: number; y: number } | null = null

    const fillAll = () => {
      ctx.fillStyle = color
      ctx.fillRect(0, 0, width, height)
    }

    const resize = () => {
      const rect = host.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cell = Math.round(Math.min(28, Math.max(14, width / 60)))
      cols = Math.ceil(width / cell)
      rows = Math.ceil(height / cell)
      intensity = new Float32Array(cols * rows)
      threshold = Float32Array.from({ length: cols * rows }, () => Math.random())
      fillAll()
    }

    const reveal = (x: number, y: number) => {
      const radius = cell * 7
      const c0 = Math.max(0, Math.floor((x - radius) / cell))
      const c1 = Math.min(cols - 1, Math.floor((x + radius) / cell))
      const r0 = Math.max(0, Math.floor((y - radius) / cell))
      const r1 = Math.min(rows - 1, Math.floor((y + radius) / cell))
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const dx = (c + 0.5) * cell - x
          const dy = (r + 0.5) * cell - y
          const v = 1 - Math.hypot(dx, dy) / radius
          if (v > 0) {
            const i = r * cols + c
            if (v > intensity[i]) intensity[i] = v
          }
        }
      }
    }

    const frame = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000)
      last = time
      fillAll()
      let alive = false
      for (let i = 0; i < intensity.length; i++) {
        if (intensity[i] <= 0) continue
        intensity[i] -= dt * 1.6
        if (intensity[i] > threshold[i]) {
          const c = i % cols
          const r = (i - c) / cols
          ctx.clearRect(c * cell, r * cell, cell, cell)
        }
        if (intensity[i] > 0) alive = true
      }
      raf = alive ? requestAnimationFrame(frame) : 0
    }

    const start = () => {
      if (raf) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      // Заполняем путь между событиями, чтобы не было разрывов при быстром движении
      const from = pointer ?? { x, y }
      const steps = Math.max(1, Math.ceil(Math.hypot(x - from.x, y - from.y) / (cell / 2)))
      for (let s = 1; s <= steps; s++) {
        reveal(from.x + ((x - from.x) * s) / steps, from.y + ((y - from.y) * s) / steps)
      }
      pointer = { x, y }
      start()
    }
    const onLeave = () => {
      pointer = null
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(host)
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none absolute inset-0 size-full ${className}`} />
}
