import { useEffect } from 'react'
import { X } from 'lucide'
import { Icon } from './Icon'

interface ToastProps {
  message: string
  onClose: () => void
  duration?: number
}

// Всплывающее сообщение об ошибке; закрывается само или по кнопке
export function Toast({ message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, duration)
    return () => window.clearTimeout(timer)
  }, [message, duration, onClose])

  return (
    <div
      role="alert"
      className="fixed top-[calc(var(--header-h)+var(--spacing-gap))] left-1/2 z-[60] flex w-[min(calc(var(--spacing)*112),calc(100%-2rem))] -translate-x-1/2 items-start gap-3 rounded-2xl border border-error bg-black px-4 py-3 text-sm leading-5 text-white shadow-lg"
    >
      <p className="flex-1">{message}</p>
      <button
        type="button"
        aria-label="Закрыть уведомление"
        className="shrink-0 cursor-pointer text-white/70 hover:text-white"
        onClick={onClose}
      >
        <Icon icon={X} />
      </button>
    </div>
  )
}
