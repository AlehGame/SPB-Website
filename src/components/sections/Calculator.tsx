import { useCallback, useState } from 'react'
import { ACCEPT_ATTRIBUTE, useUploadedImage } from '../../hooks/useUploadedImage'
import {
  calcQuote,
  formatArea,
  formatHours,
  formatMeters,
  formatPrice,
  HEIGHT_RANGE,
  PRICE_TIERS,
  WIDTH_RANGE,
} from '../../lib/pricing'
import { Button } from '../ui/Button'
import { buttonClass } from '../ui/buttonClass'
import { RangeSlider } from '../ui/RangeSlider'
import { Toast } from '../ui/Toast'
import { UploadIcon } from '../ui/UploadIcon'

// Размер слоя с изображением в визуализаторе: от 20% до 100% области
const layerSize = (value: number, min: number, max: number) => 20 + (80 * (value - min)) / (max - min)

export function Calculator() {
  const [width, setWidth] = useState(2.5)
  const [height, setHeight] = useState(2.7)
  const [error, setError] = useState<string | null>(null)
  const closeError = useCallback(() => setError(null), [])
  const wall = useUploadedImage(setError)
  const print = useUploadedImage(setError)

  const quote = calcQuote(width, height)

  return (
    <section id="prices" className="flex min-h-svh w-full items-center bg-bg-1 py-[clamp(3rem,1.9rem+4.7vw,6rem)]">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-[clamp(2rem,1.2rem+3.5vw,4.25rem)] px-page">
        <div className="flex flex-col justify-between gap-gap-lg lg:flex-row lg:items-end">
          <h2 className="max-w-[7.3em] text-hero leading-none font-extrabold text-black">
            Примерьте на своей стене
          </h2>
          <p className="max-w-[25.3rem] text-base text-body">
            Задайте размеры, загрузите свое изображение и фото стены. Цена и время печати считаются сразу.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-gap lg:grid-cols-[minmax(0,1fr)_24rem]">
          {/* Визуализатор: слой «wall image» (фото стены) и слой «image for wall» (изображение для печати) */}
          <div className="flex flex-col rounded-[var(--radius-card)] bg-white p-page">
            <div className="relative aspect-[712/524] min-h-64 w-full flex-1 overflow-hidden bg-bg-1 lg:aspect-auto">
              {wall.url && <img src={wall.url} alt="Фото вашей стены" className="absolute inset-0 size-full object-cover" />}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden transition-[width,height] duration-150 ease-out"
                style={{
                  width: `${layerSize(width, WIDTH_RANGE.min, WIDTH_RANGE.max)}%`,
                  height: `${layerSize(height, HEIGHT_RANGE.min, HEIGHT_RANGE.max)}%`,
                }}
              >
                {print.url ? (
                  <img src={print.url} alt="Изображение для печати" className="size-full object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center border border-dashed border-line bg-bg-2/80 p-2 text-center text-sm text-body">
                    Изображение для печати
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Калькулятор */}
          <div className="flex flex-col gap-6 rounded-[var(--radius-card)] bg-white p-6">
            <div className="flex flex-col gap-3">
              <RangeSlider
                label="Ширина"
                valueText={formatMeters(width)}
                {...WIDTH_RANGE}
                value={width}
                onChange={setWidth}
              />
              <RangeSlider
                label="Высота (до 3 м / за проход)"
                valueText={formatMeters(height)}
                {...HEIGHT_RANGE}
                value={height}
                onChange={setHeight}
              />
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm font-bold text-black">Загрузите фото стены и изображение</p>
              <div className="grid grid-cols-1 gap-1 min-[420px]:grid-cols-2">
                {[
                  { label: 'Фото стены', image: wall },
                  { label: 'Фото для печати', image: print },
                ].map(({ label, image }) => (
                  <div key={label} className="contents">
                    <input
                      ref={image.inputRef}
                      type="file"
                      accept={ACCEPT_ATTRIBUTE}
                      className="sr-only"
                      tabIndex={-1}
                      aria-label={label}
                      onChange={image.onChange}
                    />
                    <Button
                      variant="outline"
                      className="px-2"
                      leftIcon={<UploadIcon />}
                      aria-pressed={image.url !== null}
                      onClick={image.open}
                    >
                      {label}
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs font-medium text-body">Формат фото: png, jpeg, webp</p>
            </div>

            <div className="flex flex-col gap-1 rounded-[22px] bg-black px-4 pt-3 pb-[17px] text-white" aria-live="polite">
              <p className="text-sm leading-6 font-medium">Ориентировочно</p>
              <p className="text-[2rem] leading-tight font-bold">{formatPrice(quote.total)}</p>
              <p className="flex flex-wrap items-center gap-x-3 text-xs leading-[14px]">
                <span>
                  {formatArea(quote.area)} x {formatPrice(quote.rate)}
                </span>
                <span aria-hidden>•</span>
                <span>Печать: {formatHours(quote.hoursMin, quote.hoursMax)}</span>
              </p>
            </div>

            <ul className="flex flex-col gap-3 text-xs leading-4 text-black">
              {PRICE_TIERS.map((tier, i) => (
                <li
                  key={tier.label}
                  className={`grid grid-cols-[6.06rem_1fr_auto] items-center ${i === quote.tierIndex ? 'font-bold' : ''}`}
                >
                  <span>{tier.label}</span>
                  <span aria-hidden className="h-1 rounded-full bg-black" style={{ width: `${tier.bar}%` }} />
                  <span className="pl-6">{formatPrice(tier.rate)}</span>
                </li>
              ))}
            </ul>

            <a href="#contacts" className={`${buttonClass('fill')} w-full`}>
              Отправить расчет
            </a>
          </div>
        </div>
      </div>
      {error && <Toast message={error} onClose={closeError} />}
    </section>
  )
}
