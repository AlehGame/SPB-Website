type Price =
  | { kind: 'fixed'; value: number } // фиксированная сумма за заказ
  | { kind: 'perM2'; min: number; max: number } // цена за м² (от и до)
  | { kind: 'custom' } // рассчитывается индивидуально

// Минимальный заказ, ₽ (стена до 2 м²)
export const MIN_ORDER = 16000

// Тарифы: цена зависит от общей площади стены (до `max` включительно).
// bar — длина линии в списке цен в пикселях макета; null — линия из точек (индивидуальный расчёт).
export const PRICE_TIERS: readonly { label: string; max: number; price: Price; bar: number | null }[] = [
  { label: 'До 2 м²', max: 2, price: { kind: 'fixed', value: MIN_ORDER }, bar: 138 },
  { label: '2–5 м²', max: 5, price: { kind: 'perM2', min: 5000, max: 8000 }, bar: 118 },
  { label: '5–10 м²', max: 10, price: { kind: 'perM2', min: 4500, max: 6000 }, bar: 88 },
  { label: '10–50 м²', max: 50, price: { kind: 'perM2', min: 4000, max: 5000 }, bar: 58 },
  { label: 'От 50 м²', max: Infinity, price: { kind: 'custom' }, bar: null },
]
// Скорость печати, м²/ч (быстрый и медленный режим)
const SPEED_FAST = 6
const SPEED_SLOW = 1.5

export const WIDTH_RANGE = { min: 1, max: 100, step: 0.5 }
export const HEIGHT_RANGE = { min: 0.5, max: 4.8, step: 0.1 }

export function getTierIndex(area: number) {
  return PRICE_TIERS.findIndex((tier) => area <= tier.max)
}

// Округляем итог до сотен рублей
const roundPrice = (n: number) => Math.round(n / 100) * 100

export function calcQuote(width: number, height: number) {
  const area = Math.round(width * height * 100) / 100
  const tierIndex = getTierIndex(area)
  const { price } = PRICE_TIERS[tierIndex]
  return {
    area,
    tierIndex,
    price,
    // Итоговая сумма «от» и «до»; null, если расчёт индивидуальный
    total:
      price.kind === 'fixed'
        ? { from: price.value, to: price.value }
        : price.kind === 'perM2'
          ? { from: roundPrice(area * price.min), to: roundPrice(area * price.max) }
          : null,
    hoursMin: area / SPEED_FAST,
    hoursMax: area / SPEED_SLOW,
  }
}

const decimal = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',')

export const formatMeters = (n: number) => `${decimal(n)} м`
export const formatArea = (n: number) => `${decimal(n)} м²`
export const formatPrice = (n: number) => `${n.toLocaleString('ru-RU')} ₽`
export const formatHours = (min: number, max: number) => `${decimal(min)}–${decimal(max)} ч.`
export const formatPriceRange = (from: number, to: number) =>
  from === to ? formatPrice(from) : `${from.toLocaleString('ru-RU')} – ${formatPrice(to)}`

export const formatTierPrice = (price: Price) =>
  price.kind === 'fixed'
    ? formatPrice(price.value)
    : price.kind === 'perM2'
      ? formatPriceRange(price.min, price.max)
      : 'Индивидуально'
