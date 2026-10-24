import { useEffect, useRef, useState, type ChangeEvent } from 'react'

// Выбор изображения пользователем: превью через object URL (файл никуда не отправляется)
export function useUploadedImage() {
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
    if (file && file.type.startsWith('image/')) setUrl(URL.createObjectURL(file))
    event.target.value = '' // чтобы можно было выбрать тот же файл повторно
  }

  return { url, inputRef, onChange, open: () => inputRef.current?.click() }
}
