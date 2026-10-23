import heroImage from '../../assets/images/hero-image.webp'
import { FillButton } from '../ui/Button'

const features = [
  { title: '300 DPI', text: 'разрешение, полная палитра CMYK + белый' },
  { title: 'до 3 м.', text: 'высота за один проход, ширина не ограничена' },
  { title: 'УФ', text: 'краска сохнет мгновенно под лампой' },
  { title: '1,5–6 м²/ч', text: 'скорость печати' },
]

// Границы ячеек: 1 колонка (<sm), 2 колонки (sm), 4 колонки (lg)
const cellBorders = [
  'sm:border-r',
  'lg:border-r',
  'sm:border-r',
  '',
]

export function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-gap px-page pt-gap">
      <div className="relative flex min-h-[clamp(30rem,27.5rem+10.6vw,36rem)] flex-col justify-between gap-gap-lg overflow-hidden rounded-card bg-bg-2 p-card">
        <div className="relative z-10 flex w-full max-w-[34rem] flex-col gap-gap-lg">
          <h1 className="text-hero leading-none font-extrabold text-black">
            Любая картинка прямо&nbsp; у вас на стене
          </h1>
          <p className="max-w-[30rem] text-base leading-6 text-body">
            У нас нет ограничений, вы можете скачать или сгенерировать в ИИ любое
            изображение и мы нанесем его на вашу стену.
          </p>
        </div>

        {/* Место под изображение; на десктопе — справа, на мобильном — между текстом и кнопкой */}
        <img
          src={heroImage}
          alt="Фреска, нанесённая на стену"
          className="aspect-[2/1] w-full rounded-[calc(var(--radius-card)/1.5)] object-cover lg:absolute lg:top-card lg:right-card lg:bottom-auto lg:aspect-auto lg:h-[55%] lg:w-[42%]"
        />

        <div className="relative z-10 flex flex-col items-start gap-gap sm:flex-row sm:items-center">
          <FillButton>Попробовать услугу</FillButton>
          <div className="flex max-w-[15.125rem] flex-col gap-1 leading-6">
            <p className="text-price font-bold text-black">От 2500₽/м2</p>
            <p className="text-sm font-medium text-body">
              Чем больше площадь, тем дешевле.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ title, text }, i) => (
          <div
            key={title}
            className={`flex flex-col gap-4 border-b border-line px-card py-4 ${cellBorders[i]}`}
          >
            <p className="text-base font-extrabold text-black uppercase">{title}</p>
            <p className="text-sm text-body">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
