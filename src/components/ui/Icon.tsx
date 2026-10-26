import { MorphIcon, type MorphIconProps } from 'morphicons/react'

export type { IconInput } from 'morphicons/react'

// Иконки — данные Lucide (import { Phone } from 'lucide'), рендерит morphicons.
// Размер 20 макетных px масштабируется через --u (CSS перекрывает атрибуты width/height).
export function Icon({ className = '', strokeWidth = 1.5, ...props }: MorphIconProps) {
  return (
    <MorphIcon
      size={20}
      strokeWidth={strokeWidth}
      color="currentColor"
      className={`size-5 shrink-0 ${className}`}
      {...props}
    />
  )
}
