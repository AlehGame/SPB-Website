import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function FillButton({ className = '', children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-sm leading-6 font-semibold whitespace-nowrap text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
