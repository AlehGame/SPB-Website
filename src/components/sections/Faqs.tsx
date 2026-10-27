import { useId, useState } from 'react'
import { Plus, X } from 'lucide'
import { Icon } from '../ui/Icon'

// В макете для всех вопросов использован один и тот же текст ответа
const ANSWER =
  'Особая подготовка не нужна, это одно из преимуществ технологии. Пол и мебель закрываем перед началом работ'

const questions = [
  'Нужно ли готовить стену?',
  'Можно напечатать картинку из интернета, нейросети или логотип?',
  'Какой максимальный размер?',
  'Почему печать не доходит до угла, пола и потолка?',
  'Как быстро печатаете?',
  'Работаете ли вы за пределами Петербурга?',
  'Безопасно ли это для детей?',
].map((question) => ({ question, answer: ANSWER }))

export function Faqs() {
  // Открыт один вопрос; по умолчанию — первый, как в макете
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const baseId = useId()

  return (
    <section id="faqs" className="w-full bg-white py-section">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col justify-between gap-block px-page lg:flex-row">
        <div className="flex w-70.75 shrink-0 flex-col gap-6">
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
                  <span className="text-xl leading-6 font-semibold text-black">{question}</span>
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
