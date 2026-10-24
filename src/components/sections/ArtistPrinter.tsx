import wall1 from '../../assets/images/wall-1.webp'
import wall2 from '../../assets/images/wall-2.webp'
import wall3 from '../../assets/images/wall-3.webp'

const cards = [
  {
    image: wall1,
    number: '01',
    title: 'Стена',
    text: 'Пустая стена без различных графических элементов',
  },
  {
    image: wall2,
    number: '02',
    title: 'Принтер',
    text: 'Принтер печатает ровно и быстро, но у углов, пола и потолка остаётся полоса, которую он не достаёт.',
  },
  {
    image: wall3,
    number: '03',
    title: 'Принтер + Художник',
    text: 'Художник-аэрографист дорисовывает технические отступы и добавляет авторские детали. Стена выглядит цельной.',
  },
]

export function ArtistPrinter() {
  return (
    <section
      id="how-it-works"
      className="flex min-h-svh w-full items-center bg-white py-[clamp(3rem,1.9rem+4.7vw,6rem)]"
    >
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-[clamp(2rem,1.4rem+2.6vw,3.5rem)] px-page">
        <div className="flex flex-col justify-between gap-gap-lg lg:flex-row lg:items-end">
          <h2 className="max-w-[5.06em] text-hero leading-none font-extrabold text-black">
            Принтер плюс художник
          </h2>
          <div className="max-w-[26.7rem] text-base text-body">
            <p>
              Принтер не печатает вплотную к углам, полу и потолку: нужен отступ 30–40 см.
              Художник-аэрографист дорисовывает его и дорабатывает печать.
            </p>
            <p>Отдельно ни один из них не даёт такого результата.</p>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-gap md:grid-cols-3">
          {cards.map(({ image, number, title, text }) => (
            <li
              key={number}
              className="flex flex-col items-center gap-4 rounded-2xl border border-line px-card pt-card pb-[clamp(2rem,1.6rem+1.7vw,3.25rem)] text-center"
            >
              <img src={image} alt="" width={260} height={170} className="h-auto w-[260px] max-w-full" />
              <p className="text-base leading-6 text-body">{number}</p>
              <h3 className="text-xl leading-6 font-extrabold text-black">{title}</h3>
              <p className="max-w-[20rem] text-sm leading-5 text-body">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
