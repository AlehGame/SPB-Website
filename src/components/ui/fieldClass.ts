// Цвета поля на тёмном фоне по состоянию: обычное / ошибка / disabled
export function fieldTone(error: boolean, disabled: boolean) {
  if (disabled) {
    return {
      label: 'text-input-line',
      shell: 'border-input-line text-input-line',
      control: 'text-input-line placeholder:text-input-line',
    }
  }
  if (error) {
    return {
      label: 'text-bg-2',
      shell: 'border-error text-error',
      control: 'text-error placeholder:text-error',
    }
  }
  return {
    label: 'text-bg-2',
    shell: 'border-input-line text-field focus-within:border-white',
    control: 'text-white placeholder:text-field',
  }
}

// Общие классы самого элемента ввода внутри поля
export const controlBase = 'min-w-0 flex-1 bg-transparent text-base leading-6 outline-none'
