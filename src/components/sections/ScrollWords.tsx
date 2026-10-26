const rowLeft = ['Детские сады', 'Частные дома', 'Кафе', 'Рестораны', 'Институты']
const rowRight = ['Школы', 'Детские сады', 'Частные дома', 'Кафе', 'Рестораны', 'Институты', 'Офисы']

// Сколько раз повторяем набор слов внутри одной копии, чтобы она была шире экрана
const REPEATS = 4

function Row({ words, direction }: { words: string[]; direction: 'left' | 'right' }) {
  const items = Array.from({ length: REPEATS }, () => words).flat()
  const animation = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'

  return (
    <div className="flex w-full overflow-hidden">
      {/* Две одинаковые копии: на -50% трек возвращается в исходную точку — цикл без шва */}
      <div className={`flex shrink-0 will-change-transform ${animation}`}>
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className="flex shrink-0 items-center gap-words pr-words"
          >
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
    </div>
  )
}

// Всегда на всю ширину окна; верхняя строка идёт влево, нижняя — вправо
export function ScrollWords() {
  return (
    <section
      aria-label="Для кого мы печатаем"
      className="fluid-wide flex w-full flex-col gap-gap py-block uppercase"
    >
      <Row words={rowLeft} direction="left" />
      <Row words={rowRight} direction="right" />
    </section>
  )
}
