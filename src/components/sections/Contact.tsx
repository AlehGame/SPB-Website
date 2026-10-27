import { Phone, Send } from 'lucide'
import { useContactForm } from '../../hooks/useContactForm'
import { BUILDING_TYPES, MAX_TASK_LENGTH } from '../../lib/contactForm'
import { Button } from '../ui/Button'
import { FileField } from '../ui/FileField'
import { Icon } from '../ui/Icon'
import { InputField } from '../ui/InputField'
import { SelectField } from '../ui/SelectField'
import { TextareaField } from '../ui/TextareaField'

export function Contact() {
  const { values, errors, status, sentCount, setField, submit } = useContactForm()
  const submitting = status === 'submitting'

  return (
    <section id="contacts" className="w-full bg-black py-section text-white">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-22.25 px-page">
        <div className="flex flex-col justify-between gap-gap-lg lg:flex-row lg:items-end">
          <h2 className="max-w-[5.7em] text-hero leading-none font-extrabold">Обсудим вашу стену</h2>
          <p className="max-w-116.5 text-base leading-6">
            Опишите задачу и приложите фото. Для школ и садов подготовим визуализацию и коммерческое предложение.
          </p>
        </div>

        {/* key меняется после успешной отправки — форма (и поле файла) очищается */}
        <form key={sentCount} noValidate onSubmit={submit} className="grid grid-cols-1 gap-gap md:grid-cols-2">
          <InputField
            name="name"
            label="Имя"
            placeholder="Как к вам обращаться"
            autoComplete="name"
            value={values.name}
            error={Boolean(errors.name)}
            helper={errors.name}
            onChange={(event) => setField('name', event.target.value)}
          />
          <InputField
            name="phone"
            type="tel"
            inputMode="tel"
            label="Телефон"
            placeholder="+7"
            autoComplete="tel"
            leftIcon={<Icon icon={Phone} />}
            value={values.phone}
            error={Boolean(errors.phone)}
            helper={errors.phone}
            onChange={(event) => setField('phone', event.target.value)}
          />
          <SelectField
            name="buildingType"
            label="Кто вы"
            placeholder="Выберите вариант"
            options={BUILDING_TYPES}
            value={values.buildingType}
            error={Boolean(errors.buildingType)}
            helper={errors.buildingType}
            onValueChange={(value) => setField('buildingType', value as typeof values.buildingType)}
          />
          <FileField
            name="wallPhoto"
            label="Фото стены"
            placeholder="Выбрать файл"
            file={values.wallPhoto}
            error={Boolean(errors.wallPhoto)}
            helper={errors.wallPhoto}
            onFileChange={(file) => setField('wallPhoto', file)}
          />
          <TextareaField
            name="task"
            label="Задача"
            placeholder="Что хотите напечатать и где?"
            maxLength={MAX_TASK_LENGTH}
            className="md:col-span-2"
            value={values.task}
            onChange={(event) => setField('task', event.target.value)}
          />

          {/* Honeypot против ботов: скрыт от людей и от скринридеров */}
          <input
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute -left-[9999px] size-px opacity-0"
            value={values.website}
            onChange={(event) => setField('website', event.target.value)}
          />

          <div className="flex flex-col gap-3 md:col-span-2">
            <Button
              type="submit"
              variant="outline-light"
              size="lg"
              disabled={submitting}
              className="w-full"
              leftIcon={<Icon icon={Send} />}
            >
              {submitting ? 'Отправляем…' : 'Отправить'}
            </Button>
            {status === 'success' && (
              <p role="status" className="text-center text-sm">
                Спасибо! Заявка отправлена, мы свяжемся с вами в ближайшее время.
              </p>
            )}
            {status === 'error' && (
              <p role="alert" className="text-center text-sm text-error">
                Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
