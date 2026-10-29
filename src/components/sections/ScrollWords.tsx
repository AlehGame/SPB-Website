const words = ['Детские сады', 'Частные дома', 'Кафе', 'Рестораны', 'Институты']

// Сколько раз повторяем набор слов внутри одной копии, чтобы она была шире экрана
const REPEATS = 4
const items = Array.from({ length: REPEATS }, () => words).flat()

// Всегда на всю ширину окна; строка бесконечно идёт влево
export function ScrollWords() {
  return (
    <section aria-label="Для кого мы печатаем" className="w-full overflow-hidden bg-bg-1 py-12 uppercase md:py-22">
      {/* Две одинаковые копии: на -50% трек возвращается в исходную точку — цикл без шва */}
      <div className="flex w-max animate-marquee-left will-change-transform">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-center gap-words pr-words">
            {items.map((word, i) => (
              <li key={i} className="flex items-center gap-words">
                <span className="text-2xl font-bold whitespace-nowrap">{word}</span>
                <span aria-hidden className="text-xs font-normal">
                  ✦
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}
