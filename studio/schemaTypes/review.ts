/**
 * Видео-отзыв для секции «Клиенты говорят» на сайте.
 * Клиент добавляет и удаляет видео в Studio, сайт читает их при загрузке страницы.
 */
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'review',
  title: 'Видео-отзыв',
  type: 'document',
  fields: [
    defineField({
      name: 'video',
      title: 'Видео',
      type: 'file',
      options: { accept: 'video/*' },
      description:
        'Формат MP4, лучше до 10 МБ и вертикальное (как в видео-отзывах). Чем легче файл, тем быстрее грузится сайт.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Название (необязательно)',
      type: 'string',
      description:
        'Например: Школа №5, отзыв директора. На сайте не показывается, нужно для удобства списка и доступности.',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'order',
      title: 'Порядок (необязательно)',
      type: 'number',
      description: 'Чем меньше число, тем левее видео. Без числа новые видео идут первыми.',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'video.asset.originalFilename' } },
  orderings: [
    { title: 'Сначала новые', name: 'createdAtDesc', by: [{ field: '_createdAt', direction: 'desc' }] },
    { title: 'По порядку', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
})
