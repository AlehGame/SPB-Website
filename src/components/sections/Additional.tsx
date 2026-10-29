const features = [
  { title: '300 DPI', text: 'разрешение, полная палитра CMYK + белый' },
  { title: 'до 3 м.', text: 'высота за один проход, ширина не ограничена' },
  { title: 'УФ', text: 'краска сохнет мгновенно под лампой' },
  { title: '1,5–6 м²/ч', text: 'скорость печати' },
]

export function Additional() {
  return (
    <section className="w-full border-b border-line bg-bg-2">
      <ul className="mx-auto grid max-w-[1920px] grid-cols-1 px-page sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ title, text }) => (
          <li
            key={title}
            className="flex flex-col gap-4 border-b border-line py-8 sm:border-b-0 sm:px-8 sm:py-4 sm:max-lg:nth-[n+3]:border-t sm:max-lg:nth-[2n]:border-l lg:not-first:border-l"
          >
            <p className="text-base leading-[normal] font-extrabold text-black uppercase">{title}</p>
            <p className="text-sm leading-[normal] text-body">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
