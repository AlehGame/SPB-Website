import type { ReactNode } from 'react'

interface BlockProps {
  label: string
  /** Ширина блока в ряду (доля), по макету */
  grow: string
  dark?: boolean
  className?: string
  children: ReactNode
}

function Block({ label, grow, dark = false, className = '', children }: BlockProps) {
  return (
    <li
      className={`flex flex-col justify-between gap-12 rounded-card p-gap lg:min-h-62.25 lg:gap-gap ${grow} ${
        dark ? 'bg-black text-white' : 'bg-white text-black'
      } ${className}`}
    >
      <p className={`text-sm uppercase ${dark ? 'font-normal text-white' : 'font-normal text-body md:font-semibold'}`}>
        {label}
      </p>
      {children}
    </li>
  )
}

const bigText = 'text-2xl leading-8 font-bold md:text-3xl md:leading-10'

export function Numbers() {
  return (
    <section id="numbers" className="w-full bg-bg-1 px-page py-section">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-block">
        <h2 className="max-w-[7.3em] text-hero leading-none font-extrabold text-black">Надежность и цифры</h2>

        {/* Ширины блоков в рядах заданы пропорциями макета (327:491:334 и 412:302:438) */}
        <div className="flex flex-col gap-gap">
          <ul className="flex flex-col gap-gap lg:flex-row">
            <Block label="Светостойкость" grow="lg:flex-[327_1_0%]" className="max-lg:min-h-62.25 max-lg:gap-8">
              <div className="flex flex-col gap-gap">
                <p className="bg-brand bg-clip-text text-[4rem] font-bold text-transparent uppercase lg:text-hero">
                  8 лет
                </p>
                <p className="text-base leading-6">По данным производителя чернил</p>
              </div>
            </Block>
            <Block label="Стойкость" grow="lg:flex-[491_1_0%]">
              <p className={`${bigText} lg:max-w-[9.66em]`}>Не боится царапин и стирания, печать не сползает</p>
            </Block>
            <Block label="Безопасность" grow="lg:flex-[334_1_0%]">
              <p className={`${bigText} lg:max-w-[9em]`}>Негорючие чернила</p>
            </Block>
          </ul>

          <ul className="flex flex-col gap-gap lg:flex-row">
            <Block label="Поверхности" grow="lg:flex-[412_1_0%]">
              <p className={bigText}>Одни чернила для любых поверхностей, в том числе шероховатых</p>
            </Block>
            <Block label="Цвет" grow="lg:flex-[302_1_0%]" className="max-lg:gap-8" dark>
              <div className="flex flex-col gap-gap">
                <p className="text-5xl font-bold whitespace-nowrap">
                  <span className="text-[#4ba5ef]">C</span>
                  <span className="text-[#9c0b4c]">M</span>
                  <span className="text-[#ddac2d]">Y</span>
                  <span className="text-[#696969]">K</span>
                  <span className="text-white">+W</span>
                </p>
                <p className="text-base leading-6">Белый слой под цветом: яркость на тёмных и цветных стенах.</p>
              </div>
            </Block>
            <Block label="Изображения" grow="lg:flex-[438_1_0%]" className="pr-13.5">
              <p className={bigText}>Любая картинка из интернета, нейросети или логотип</p>
            </Block>
          </ul>
        </div>
      </div>
    </section>
  )
}
