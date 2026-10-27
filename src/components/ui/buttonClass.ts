export type ButtonVariant = 'fill' | 'outline' | 'outline-light'
export type ButtonSize = 'sm' | 'lg'

const base =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border bg-origin-border text-sm leading-6 font-semibold whitespace-nowrap disabled:pointer-events-none'

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2',
  lg: 'px-6 py-4',
}

// Default / Hover (градиент бренда) / Pressed (розовый) / Disabled
const variants: Record<ButtonVariant, string> = {
  fill: 'border-transparent bg-black text-white hover:bg-brand active:bg-pink active:bg-none disabled:bg-black disabled:bg-none disabled:text-body',
  outline:
    'border-black text-black hover:border-transparent hover:bg-brand hover:text-white active:border-transparent active:bg-pink active:bg-none active:text-white disabled:border-line disabled:text-line',
  // Контурная кнопка для тёмного фона
  'outline-light':
    'border-white text-white hover:border-transparent hover:bg-brand active:border-transparent active:bg-pink active:bg-none disabled:border-input-line disabled:text-field',
}

// Классы кнопки; нужны и для других элементов (например, <a href="tel:...">)
export function buttonClass(variant: ButtonVariant = 'fill', size: ButtonSize = 'sm') {
  return `${base} ${sizes[size]} ${variants[variant]}`
}
