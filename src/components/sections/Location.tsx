import mapImage from '../../assets/images/location-map.webp'

const locations = [
  { dot: 'bg-map-main', text: 'Основная локация: Санкт-Петербург и Ленинградская область' },
  { dot: 'bg-map-trip', text: 'Выезды: Псковская и Новгородская области, Мурманск, Москва' },
]

export function Location() {
  return (
    <section id="location" className="w-full bg-bg-1 py-section">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col items-start justify-between gap-block px-page lg:flex-row lg:items-center">
        <div className="flex w-full max-w-88 shrink-0 flex-col gap-14">
          <h2 className="text-hero leading-none font-bold text-black">Где работаем</h2>
          <ul className="flex flex-col gap-6">
            {locations.map(({ dot, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span aria-hidden className={`mt-0.5 size-3 shrink-0 rounded-full ${dot}`} />
                <p className="text-sm font-medium text-body">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="aspect-[716/510] w-full overflow-hidden rounded-card bg-white lg:w-179">
          <img
            src={mapImage}
            alt="Карта: основная локация — Санкт-Петербург; выезды — Псков, Новгород, Мурманск и Москва"
            width={716}
            height={510}
            className="size-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
