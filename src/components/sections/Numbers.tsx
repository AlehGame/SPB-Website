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
      className={`flex min-h-[calc(249*var(--u))] flex-col justify-between gap-u24 rounded-u24 p-u24 ${grow} ${
        dark ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      <p className={`text-u14 leading-normal uppercase ${dark ? 'text-white' : 'text-body'}`}>{label}</p>
      {children}
    </li>
  )
}

const bigText = 'text-u32 leading-[1.25] font-bold'

export function Numbers() {
  return (
    <section id="numbers" className="flex w-full flex-col gap-u56 bg-bg-1 px-u40 py-u96">
      <h2 className="max-w-[7.3em] text-display leading-none font-extrabold text-black">Надежность и цифры</h2>

      {/* Ширины блоков в рядах заданы пропорциями макета (327:491:334 и 412:302:438) */}
      <div className="flex flex-col gap-u24">
        <ul className="flex flex-col gap-u24 lg:flex-row">
          <Block label="Светостойкость" grow="lg:flex-[327_1_0%]">
            <div className="flex flex-col gap-u24">
              <p className="bg-brand bg-clip-text text-display leading-none font-bold text-transparent uppercase">
                8 лет
              </p>
              <p className="text-step leading-[1.5]">По данным производителя чернил</p>
            </div>
          </Block>
          <Block label="Стойкость" grow="lg:flex-[491_1_0%]">
            <p className={`${bigText} max-w-[10em]`}>Не боится царапин и стирания, печать не сползает</p>
          </Block>
          <Block label="Экология" grow="lg:flex-[334_1_0%]">
            <p className={`${bigText} max-w-[9em]`}>Негорючие чернила</p>
          </Block>
        </ul>

        <ul className="flex flex-col gap-u24 lg:flex-row">
          <Block label="Поверхности" grow="lg:flex-[412_1_0%]">
            <p className={bigText}>Одни чернила для любых поверхностей, в том числе шероховатых</p>
          </Block>
          <Block label="Цвет" grow="lg:flex-[302_1_0%]" dark>
            <div className="flex flex-col gap-u24">
              <p className="text-u48 leading-none font-bold whitespace-nowrap">
                <span className="text-[#4ba5ef]">C</span>
                <span className="text-[#9c0b4c]">M</span>
                <span className="text-[#ddac2d]">Y</span>
                <span className="text-[#696969]">K</span>
                <span className="text-white">+W</span>
              </p>
              <p className="text-step leading-[1.5]">Белый слой под цветом: яркость на тёмных и цветных стенах.</p>
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
