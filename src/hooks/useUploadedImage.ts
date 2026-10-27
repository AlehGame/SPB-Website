import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { ACCEPTED_IMAGE_TYPES } from '../lib/imageFormats'

// Выбор изображения пользователем: превью через object URL (файл никуда не отправляется).
// Если формат не подходит, вызывается onReject с текстом ошибки.
export function useUploadedImage(onReject: (message: string) => void) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState<string | null>(null)

  // Освобождаем предыдущий object URL при замене файла и при размонтировании
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = '' // чтобы можно было выбрать тот же файл повторно
    if (!file) return

    if (ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setUrl(URL.createObjectURL(file))
    } else {
      onReject(`Формат файла «${file.name}» не поддерживается. Загрузите изображение png, jpeg или webp.`)
    }
  }

  return { url, inputRef, onChange, open: () => inputRef.current?.click() }
}
