/**
 * Схема документа для Sanity Studio: заявки с формы на сайте.
 * Подключён в studio/schemaTypes/index.ts.
 * Студия лежит в папке studio/ и не входит в сборку сайта.
 *
 * Поля совпадают с SanityContactRequest из src/lib/contactForm.ts.
 * Поле wallPhoto заполняет серверная функция (см. src/lib/contactApi.ts).
 */
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactRequest',
  title: 'Заявка с сайта',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Имя', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'phone', title: 'Телефон', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'buildingType',
      title: 'Кто обратился',
      type: 'string',
      options: {
        list: ['Школа', 'Школа искусств', 'Детский сад', 'Кафе', 'Ресторан', 'Офис', 'Частный дом', 'Другое'],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'task', title: 'Задача', type: 'text', rows: 4 }),
    defineField({ name: 'wallPhoto', title: 'Фото стены', type: 'image' }),
    defineField({
      name: 'processed',
      title: 'Обработана',
      type: 'boolean',
      description: 'Отметьте, когда связались с клиентом',
      initialValue: false,
    }),
    defineField({ name: 'submittedAt', title: 'Дата отправки', type: 'datetime', readOnly: true }),
    defineField({ name: 'source', title: 'Страница отправки', type: 'url', readOnly: true }),
  ],
  preview: {
    select: { title: 'name', phone: 'phone', type: 'buildingType', processed: 'processed' },
    prepare: ({ title, phone, type, processed }) => ({
      title: `${processed ? '✓ ' : ''}${title}`,
      subtitle: `${phone} · ${type}`,
    }),
  },
  orderings: [{ title: 'Сначала новые', name: 'submittedAtDesc', by: [{ field: 'submittedAt', direction: 'desc' }] }],
})
