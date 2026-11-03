import { useCallback, useState } from 'react'
import { useUploadedImage } from '../../hooks/useUploadedImage'
import { ACCEPT_ATTRIBUTE } from '../../lib/imageFormats'
import {
  calcQuote,
  formatArea,
  formatHours,
  formatMeters,
  formatPriceRange,
  formatTierPrice,
  HEIGHT_RANGE,
  PRICE_TIERS,
  WIDTH_RANGE,
} from '../../lib/pricing'
import { Button } from '../ui/Button'
import { buttonClass } from '../ui/buttonClass'
import { RangeSlider } from '../ui/RangeSlider'
import { Toast } from '../ui/Toast'
import { UploadIcon } from '../ui/UploadIcon'
import { WallPreview } from '../ui/WallPreview'

export function Calculator() {
  const [width, setWidth] = useState(2.5)
  const [height, setHeight] = useState(2.7)
  const [error, setError] = useState<string | null>(null)
  const closeError = useCallback(() => setError(null), [])
  const wall = useUploadedImage(setError)
  const print = useUploadedImage(setError)

  const quote = calcQuote(width, height)
  const { total, price } = quote
  const isRange = !total || total.from !== total.to
  const headline = total ? formatPriceRange(total.from, total.to) : 'Индивидуальный расчет'
  const details =
    price.kind === 'fixed'
      ? 'Минимальный выезд'
      : price.kind === 'perM2'
        ? `${formatArea(quote.area)} x ${formatTierPrice(price)}`
        : formatArea(quote.area)

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
          <WallPreview width={width} height={height} wallUrl={wall.url} printUrl={print.url} />

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
              <p className={`${isRange ? 'text-2xl' : 'text-3xl'} leading-tight font-bold`}>{headline}</p>
              <p className="flex flex-wrap items-center gap-x-3 text-xs leading-3.5">
                <span>{details}</span>
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
                  <span>
                    {tier.label}
                    {tier.note && <span className="block text-[10px] leading-3 font-normal">{tier.note}</span>}
                  </span>
                  <span aria-hidden className="h-1 rounded-full bg-black" style={{ width: `${tier.bar}%` }} />
                  <span className="pl-6">{formatTierPrice(tier.price)}</span>
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
