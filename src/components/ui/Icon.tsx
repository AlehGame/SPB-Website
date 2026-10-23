import { MorphIcon, type MorphIconProps } from 'morphicons/react'

export type { IconInput } from 'morphicons/react'

// Иконки — данные Lucide (import { Phone } from 'lucide'), рендерит morphicons
export function Icon({ size = 20, strokeWidth = 1.5, ...props }: MorphIconProps) {
  return <MorphIcon size={size} strokeWidth={strokeWidth} color="currentColor" {...props} />
}
