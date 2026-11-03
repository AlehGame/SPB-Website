// Фото со смартфона весит 3–10 МБ, и именно его загрузка делает отправку формы долгой.
// Для заявки хватает 1600 px по длинной стороне: уменьшаем и пережимаем в webp до отправки.
const MAX_SIDE = 1600
const QUALITY = 0.82
// Небольшие файлы отправляем как есть
const SKIP_BELOW = 300 * 1024

export async function prepareWallPhoto(file: File): Promise<File> {
  if (file.size <= SKIP_BELOW) return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', QUALITY))
    // Если браузер не умеет webp или файл не стал меньше, отправляем оригинал
    if (!blob || blob.type !== 'image/webp' || blob.size >= file.size) return file
    return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: blob.type })
  } catch {
    return file
  }
}
