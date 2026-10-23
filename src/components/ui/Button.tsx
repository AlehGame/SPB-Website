import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'fill' | 'outline'
type Size = 'sm' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const base =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-origin-border text-sm leading-6 font-semibold whitespace-nowrap disabled:pointer-events-none'

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2',
  lg: 'px-6 py-4',
}

// Default / Hover (градиент бренда) / Pressed (розовый) / Disabled
const variants: Record<Variant, string> = {
  fill: 'bg-black text-white hover:bg-brand active:bg-pink active:bg-none disabled:bg-black disabled:bg-none disabled:text-body',
  outline:
    'border-black text-black hover:border-transparent hover:bg-brand hover:text-white active:border-transparent active:bg-pink active:bg-none active:text-white disabled:border-line disabled:text-line',
}

export function Button({
  variant = 'fill',
  size = 'sm',
  leftIcon,
  rightIcon,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}
