import heroVideo from '../../assets/video/hero.mp4'
import { Button } from '../ui/Button'

const features = [
  { title: '300 DPI', text: 'разрешение, полная палитра CMYK + белый' },
  { title: 'до 3 м.', text: 'высота за один проход, ширина не ограничена' },
  { title: 'УФ', text: 'краска сохнет мгновенно под лампой' },
  { title: '1,5–6 м²/ч', text: 'скорость печати' },
]

export function Hero() {
  return (
    <section className="flex min-h-svh w-full flex-col bg-bg-2">
      <div className="relative flex min-h-120 flex-1 flex-col justify-end overflow-hidden text-white">
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        />

        <div className="relative mx-auto flex w-full max-w-[1920px] flex-col gap-14 px-page pt-[calc(var(--header-h)+var(--spacing-gap))] pb-22.25">
          <div className="flex max-w-134 flex-col gap-8">
            <h1 className="text-hero leading-none font-extrabold">
              Любая картинка прямо&nbsp;у вас на&nbsp;стене
            </h1>
            <p className="text-base leading-6">
              У нас нет ограничений, вы можете скачать или сгенерировать в ИИ любое изображение и
              мы нанесем его на вашу стену.
            </p>
          </div>

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <Button size="lg">Попробовать услугу</Button>
            <div className="flex max-w-60.5 flex-col gap-1 leading-6">
              <p className="text-xl font-bold">От 2500₽/м2</p>
              <p className="text-sm font-medium">Чем больше площадь, тем дешевле.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-line">
        <div className="mx-auto grid max-w-[1920px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, text }) => (
            <div
              key={title}
              className="flex flex-col gap-4 border-line px-8 py-4 not-first:border-t sm:max-lg:nth-[n+3]:border-t sm:max-lg:not-nth-[n+3]:border-t-0 sm:max-lg:nth-[2n]:border-l lg:border-t-0 lg:not-first:border-l"
            >
              <p className="text-base font-extrabold text-black uppercase">{title}</p>
              <p className="text-sm text-body">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
