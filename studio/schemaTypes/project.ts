/**
 * Проект (кейс) для секции «Кейсы» на сайте.
 * Клиент добавляет и удаляет карточки в Studio, сайт читает их при загрузке страницы.
 */
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Проект (кейс)',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Изображение проекта',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Заголовок проекта',
      type: 'string',
      description: 'Например: Коридор школы',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'location',
      title: 'Локация',
      type: 'string',
      description: 'Например: Санкт-Петербург',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'area',
      title: 'Квадратура, м²',
      type: 'number',
      description: 'Только число, например 25.5',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'order',
      title: 'Порядок (необязательно)',
      type: 'number',
      description: 'Чем меньше число, тем левее карточка. Без числа новые проекты идут первыми.',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'location', media: 'image' } },
  orderings: [
    { title: 'Сначала новые', name: 'createdAtDesc', by: [{ field: '_createdAt', direction: 'desc' }] },
    { title: 'По порядку', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
})
