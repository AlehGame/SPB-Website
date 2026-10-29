import type { AnchorHTMLAttributes } from 'react'

interface MenuLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
}

// Default / Hover (фон bg-2) / Active (градиентная рамка)
export function MenuLink({ active = false, className = '', children, ...props }: MenuLinkProps) {
  return (
    <a
      aria-current={active ? 'true' : undefined}
      className={`inline-flex items-center justify-center rounded-full border-[1.5px] px-2.5 py-0.75 text-sm leading-6 font-medium whitespace-nowrap text-black ${
        active ? 'border-brand' : 'border-transparent hover:bg-bg-2'
      } ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}
