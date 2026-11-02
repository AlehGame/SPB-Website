import { useCallback, useState } from 'react'
import { useUploadedImage } from '../../hooks/useUploadedImage'
import { ACCEPT_ATTRIBUTE } from '../../lib/imageFormats'
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

// Пропорции стены в визуализаторе ограничены, чтобы очень узкая стена (100 × 0,5 м) не превращалась в нитку
const MIN_RATIO = 0.4
const MAX_RATIO = 6

interface WallPreviewProps {
  width: number
  height: number
  wallUrl: string | null
  printUrl: string | null
}

// Блок «wall image» повторяет пропорции выбранной стены и вписывается в область визуализатора.
// Размер считается в единицах контейнера (cqw/cqh), поэтому блок масштабируется при любой ширине экрана.
function WallPreview({ width, height, wallUrl, printUrl }: WallPreviewProps) {
  const ratio = Math.min(MAX_RATIO, Math.max(MIN_RATIO, width / height))

  return (
    <div className="relative min-h-0 w-full flex-1 overflow-hidden bg-bg-1 md:aspect-[712/524] md:min-h-64 lg:aspect-auto [container-type:size]">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-line bg-bg-2 transition-[width] duration-200 ease-out"
        style={{ aspectRatio: ratio, width: `min(100cqw, calc(100cqh * ${ratio}))` }}
      >
        {wallUrl && <img src={wallUrl} alt="Фото вашей стены" className="absolute inset-0 size-full object-cover" />}
        <div className="absolute inset-[15%] overflow-hidden">
          {printUrl ? (
            <img src={printUrl} alt="Изображение для печати" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center border border-dashed border-line bg-bg-2/80 p-2 text-center text-sm text-body">
              Изображение для печати
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Calculator() {
  const [width, setWidth] = useState(2.5)
  const [height, setHeight] = useState(2.7)
  const [error, setError] = useState<string | null>(null)
  const closeError = useCallback(() => setError(null), [])
  const wall = useUploadedImage(setError)
  const print = useUploadedImage(setError)

  const quote = calcQuote(width, height)

  return (
    <section id="prices" className="flex min-h-svh w-full items-center bg-bg-1 py-22 md:py-section">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-block px-page">
        <div className="flex flex-col justify-between gap-gap-lg lg:flex-row lg:items-end">
          <h2 className="max-w-[7.3em] text-hero leading-none font-extrabold text-black">Примерьте на своей стене</h2>
          <p className="max-w-101.25 text-base text-body">
            Задайте размеры, загрузите свое изображение и фото стены. Цена и время печати считаются сразу.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-gap lg:grid-cols-[minmax(0,1fr)_calc(var(--spacing)*96)]">
          {/* Визуализатор: слой «wall image» (фото стены) и слой «image for wall» (изображение для печати) */}
          <div className="flex flex-col rounded-card bg-white p-10 max-md:aspect-[361/291] md:p-page">
            <WallPreview width={width} height={height} wallUrl={wall.url} printUrl={print.url} />
          </div>

          {/* Калькулятор */}
          <div className="flex flex-col gap-6 rounded-card bg-white px-4 py-6 md:p-6">
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
              <div className="grid grid-cols-2 gap-1">
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
                      className="px-3"
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

            <div className="flex flex-col gap-1 rounded-card bg-black px-4 pt-3 pb-4.25 text-white" aria-live="polite">
              <p className="text-sm leading-6 font-medium">Ориентировочно</p>
              <p className="text-3xl leading-tight font-bold">{formatPrice(quote.total)}</p>
              <p className="flex flex-wrap items-center gap-x-3 text-xs leading-3.5">
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
                  className={`grid grid-cols-[calc(var(--spacing)*24.25)_1fr_auto] items-center ${i === quote.tierIndex ? 'font-bold' : ''}`}
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
