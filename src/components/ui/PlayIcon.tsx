// Иконка play-circle из макета (vuesax/linear/play-circle), цвет — currentColor
export function PlayIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={className}>
      <path
        d="M58.5867 32C58.5867 46.7276 46.6476 58.6667 31.92 58.6667C17.1924 58.6667 5.25333 46.7276 5.25333 32C5.25333 17.2724 17.1924 5.33333 31.92 5.33333C46.6476 5.33333 58.5867 17.2724 58.5867 32Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.3067 32.6133V28.16C23.3067 22.6133 27.2267 20.3467 32.0267 23.12L35.8933 25.36L39.76 27.6C44.56 30.3733 44.56 34.9067 39.76 37.68L35.8933 39.92L32.0267 42.16C27.2267 44.9333 23.3067 42.6667 23.3067 37.12V32.6133Z"
        fill="currentColor"
      />
    </svg>
  )
}
