import { useId, useState } from 'react'
import { Plus, X } from 'lucide'
import { Icon } from '../ui/Icon'

// Ответы собраны из фактов, которые уже есть на сайте (условия работы, размеры, скорость, география)
const questions = [
  {
    question: 'Нужно ли готовить стену?',
    answer:
      'Особая подготовка не нужна, это одно из преимуществ технологии. Мебель и пол закрывать не нужно, для установки принтера требуется 1 м свободного места от стены.',
  },
  {
    question: 'Можно напечатать картинку из интернета, нейросети или логотип?',
    answer:
      'Да, ограничений нет: подойдёт картинка из интернета, изображение от нейросети или готовый логотип. Наши дизайнеры подготовят макет по вашим пожеланиям.',
  },
  {
    question: 'Какой максимальный размер?',
    answer:
      'Высота печати до 4.8 м за один проход, ширина не ограничена. Стоимость стен от 50 м² рассчитываем индивидуально.',
  },
  {
    question: 'Почему печать не доходит до угла, пола и потолка?',
    answer:
      'У принтера есть технические отступы у углов стены, пола и потолка. Эти места закрашивает наш художник и добавляет авторские детали.',
  },
  {
    question: 'Как быстро печатаете?',
    answer:
      'Скорость нанесения 1,5–6 м²/ч, краска сохнет под УФ-лампой сразу. Ориентировочное время печати вашей стены показывает калькулятор на сайте.',
  },
  {
    question: 'Работаете ли вы за пределами Петербурга?',
    answer:
      'Да. Основная локация — Ленинградская область, также выезжаем в Псков, Новгород, Мурманск и Москву. По другим городам уточняйте по телефону.',
  },
  {
    question: 'Безопасно ли это для детей?',
    answer:
      'Мы используем негорючие чернила и работаем со школами, школами искусств и детскими садами. Подробности о материалах расскажем по телефону или в мессенджере.',
  },
]

// Микроразметка FAQPage для расширенных сниппетов в поиске
const faqJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: questions.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
})

export function Faqs() {
  // Открыт один вопрос; по умолчанию — первый, как в макете
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const baseId = useId()

  return (
    <section id="faqs" className="w-full bg-white py-section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      <div className="mx-auto flex w-full max-w-[1920px] flex-col justify-between gap-block px-page lg:flex-row">
        <div className="flex w-full shrink-0 flex-col gap-6 lg:w-70.75">
          <h2 className="text-hero leading-none font-extrabold text-black">Частые вопросы</h2>
          <p className="text-base leading-6 text-body">Не нашли свой? Напишите в мессенджер, ответим сразу.</p>
        </div>

        <ul className="w-full border-t border-line lg:w-181">
          {questions.map(({ question, answer }, i) => {
            const open = openIndex === i
            const panelId = `${baseId}-panel-${i}`
            return (
              <li key={question} className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full cursor-pointer items-start justify-between gap-7 py-6 text-left"
                >
                  <span className="text-xl leading-7 font-semibold text-black md:leading-6">{question}</span>
                  <Icon icon={open ? X : Plus} className="size-6 text-black" />
                </button>
                <div
                  id={panelId}
                  role="region"
                  className={`grid transition-[grid-template-rows,margin] duration-300 ease-out ${
                    open ? '-mt-1.75 grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pr-13 pb-6 text-base leading-6 text-body">{answer}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
