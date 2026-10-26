import type { ReactNode } from 'react'

interface BlockProps {
  label: string
  /** Ширина блока в ряду (доля), по макету */
  grow: string
  dark?: boolean
  children: ReactNode
}

function Block({ label, grow, dark = false, children }: BlockProps) {
  return (
    <li
      className={`flex min-h-62.25 flex-col justify-between gap-gap rounded-card p-gap ${grow} ${
        dark ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      <p className={`text-sm uppercase ${dark ? 'text-white' : 'text-body'}`}>{label}</p>
      {children}
    </li>
  )
}

const bigText = 'text-3xl leading-tight font-bold'

export function Numbers() {
  return (
    <section id="numbers" className="fluid-wide flex w-full flex-col gap-block bg-bg-1 px-page py-section">
      <h2 className="max-w-[7.3em] text-hero leading-none font-extrabold text-black">Надежность и цифры</h2>

      {/* Ширины блоков в рядах заданы пропорциями макета (327:491:334 и 412:302:438) */}
      <div className="flex flex-col gap-gap">
        <ul className="flex flex-col gap-gap lg:flex-row">
          <Block label="Светостойкость" grow="lg:flex-[327_1_0%]">
            <div className="flex flex-col gap-gap">
              <p className="bg-brand bg-clip-text text-hero leading-none font-bold text-transparent uppercase">
                8 лет
              </p>
              <p className="text-base leading-normal">По данным производителя чернил</p>
            </div>
          </Block>
          <Block label="Стойкость" grow="lg:flex-[491_1_0%]">
            <p className={`${bigText} max-w-[10em]`}>Не боится царапин и стирания, печать не сползает</p>
          </Block>
          <Block label="Экология" grow="lg:flex-[334_1_0%]">
            <p className={`${bigText} max-w-[9em]`}>Негорючие чернила</p>
          </Block>
        </ul>

        <ul className="flex flex-col gap-gap lg:flex-row">
          <Block label="Поверхности" grow="lg:flex-[412_1_0%]">
            <p className={bigText}>Одни чернила для любых поверхностей, в том числе шероховатых</p>
          </Block>
          <Block label="Цвет" grow="lg:flex-[302_1_0%]" dark>
            <div className="flex flex-col gap-gap">
              <p className="text-5xl leading-none font-bold whitespace-nowrap">
                <span className="text-[#4ba5ef]">C</span>
                <span className="text-[#9c0b4c]">M</span>
                <span className="text-[#ddac2d]">Y</span>
                <span className="text-[#696969]">K</span>
                <span className="text-white">+W</span>
              </p>
              <p className="text-base leading-normal">Белый слой под цветом: яркость на тёмных и цветных стенах.</p>
            </div>
          </Block>
          <Block label="Изображения" grow="lg:flex-[438_1_0%]">
            <p className={bigText}>Любая картинка из интернета, нейросети или логотип</p>
          </Block>
        </ul>
      </div>
    </section>
  )
}
