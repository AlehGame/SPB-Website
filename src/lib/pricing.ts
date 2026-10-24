// Тарифы: цена за м² зависит от общей площади стены
export const PRICE_TIERS = [
  { label: 'До 10 м²', max: 10, rate: 3500, bar: 100 },
  { label: '10–30 м²', max: 30, rate: 3000, bar: 87 },
  { label: '30–60 м²', max: 60, rate: 2700, bar: 65 },
  { label: 'От 60 м²', max: Infinity, rate: 2500, bar: 45 },
] as const

// Скорость печати, м²/ч (быстрый и медленный режим)
const SPEED_FAST = 6
const SPEED_SLOW = 1.5

export const WIDTH_RANGE = { min: 1, max: 100, step: 0.5 }
export const HEIGHT_RANGE = { min: 0.5, max: 3, step: 0.1 }

export function getTierIndex(area: number) {
  return PRICE_TIERS.findIndex((tier) => area <= tier.max)
}

export function calcQuote(width: number, height: number) {
  const area = Math.round(width * height * 100) / 100
  const tierIndex = getTierIndex(area)
  const rate = PRICE_TIERS[tierIndex].rate
  return {
    area,
    tierIndex,
    rate,
    // Округляем итог до сотен рублей
    total: Math.round((area * rate) / 100) * 100,
    hoursMin: area / SPEED_FAST,
    hoursMax: area / SPEED_SLOW,
  }
}

const decimal = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',')

export const formatMeters = (n: number) => `${decimal(n)} м`
export const formatArea = (n: number) => `${decimal(n)} м²`
export const formatPrice = (n: number) => `${n.toLocaleString('ru-RU')} ₽`
export const formatHours = (min: number, max: number) => `${decimal(min)}–${decimal(max)} ч.`
