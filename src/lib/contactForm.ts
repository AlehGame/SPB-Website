import { ACCEPTED_IMAGE_TYPES } from './imageFormats'

// Варианты поля «Кто вы» (выпадающий список)
export const BUILDING_TYPES = [
  'Школа',
  'Школа искусств',
  'Детский сад',
  'Кафе',
  'Ресторан',
  'Офис',
  'Частный дом',
  'Другое',
] as const

export type BuildingType = (typeof BUILDING_TYPES)[number]

export const MAX_PHOTO_SIZE = 10 * 1024 * 1024 // 10 МБ
export const MAX_TASK_LENGTH = 2000

export interface ContactFormValues {
  name: string
  phone: string
  buildingType: BuildingType | ''
  task: string
  wallPhoto: File | null
  /** Honeypot: скрытое поле, которое заполняют только боты */
  website: string
}

export const initialContactValues: ContactFormValues = {
  name: '',
  phone: '',
  buildingType: '',
  task: '',
  wallPhoto: null,
  website: '',
}

export type ContactFormErrors = Partial<Record<'name' | 'phone' | 'buildingType' | 'wallPhoto', string>>

export function validateContact(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {}
  const phoneDigits = values.phone.replace(/\D/g, '')

  if (values.name.trim().length < 2) errors.name = 'Укажите, как к вам обращаться'
  if (phoneDigits.length < 10 || phoneDigits.length > 15) errors.phone = 'Укажите корректный номер телефона'
  if (!values.buildingType) errors.buildingType = 'Выберите вариант из списка'
  if (values.wallPhoto) {
    if (!ACCEPTED_IMAGE_TYPES.includes(values.wallPhoto.type)) errors.wallPhoto = 'Подойдут форматы png, jpeg, webp'
    else if (values.wallPhoto.size > MAX_PHOTO_SIZE) errors.wallPhoto = 'Файл больше 10 МБ'
  }
  return errors
}

/**
 * Документ Sanity «contactRequest» (схема: studio/schemaTypes/contactRequest.ts).
 * Фото стены в документ не входит: файл загружается как asset на стороне сервера,
 * а в документе остаётся ссылка (wallPhoto → image).
 */
export interface SanityContactRequest {
  _type: 'contactRequest'
  name: string
  phone: string
  buildingType: BuildingType
  task: string
  submittedAt: string
  source: string
}

export function toSanityDocument(values: ContactFormValues): SanityContactRequest {
  return {
    _type: 'contactRequest',
    name: values.name.trim(),
    phone: `+${values.phone.replace(/\D/g, '')}`,
    buildingType: values.buildingType as BuildingType,
    task: values.task.trim(),
    submittedAt: new Date().toISOString(),
    source: window.location.href,
  }
}
