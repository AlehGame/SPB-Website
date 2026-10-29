import heroPoster from '../../assets/images/hero-poster.webp'
import heroVideo from '../../assets/video/hero.mp4'
import { buttonClass } from '../ui/buttonClass'

export function Hero() {
  return (
    <section className="relative flex min-h-svh w-full items-end overflow-hidden text-white">
      <video
        src={heroVideo}
        poster={heroPoster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="absolute inset-0 size-full object-cover"
      />

      <div className="relative mx-auto flex w-full max-w-[1920px] flex-col justify-between gap-14 px-page pt-[calc(var(--header-h)+var(--spacing-gap))] pb-22 lg:flex-row lg:items-end lg:gap-gap-lg lg:pb-page">
        <div className="flex max-w-187.5 flex-col gap-6 md:gap-9">
          <h1 className="text-display leading-[1.04] md:leading-[0.92]">
            Любая картинка прямо&nbsp;у вас на&nbsp;стене
          </h1>
          <p className="max-w-133.5 text-base leading-6">
            У нас нет ограничений, вы можете скачать или сгенерировать в ИИ любое изображение и
            мы нанесем его на вашу стену.
          </p>
        </div>

        <div className="flex flex-col-reverse items-center gap-6 sm:flex-row-reverse sm:items-center sm:self-start lg:self-auto">
          <a href="#prices" className={`${buttonClass('fill', 'lg')} w-full sm:w-auto`}>
            Попробовать услугу
          </a>
          <div className="flex gap-4 leading-6 whitespace-nowrap sm:flex-col sm:items-end sm:gap-1">
            <p className="text-xl font-bold">От 2500₽/м2</p>
            <p className="text-base font-medium sm:text-sm">Чем больше, тем дешевле.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
