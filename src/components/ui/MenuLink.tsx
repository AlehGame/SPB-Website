import type { AnchorHTMLAttributes } from 'react'

interface MenuLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
}

// Default (текст body) / Hover (фон bg-2, чёрный текст) / Active (чёрный фон, белый текст)
export function MenuLink({ active = false, className = '', children, ...props }: MenuLinkProps) {
  return (
    <a
      aria-current={active ? 'true' : undefined}
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm leading-6 font-medium whitespace-nowrap ${
        active ? 'bg-black text-white' : 'text-body hover:bg-bg-2 hover:text-black'
      } ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}
