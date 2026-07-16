import type { ButtonHTMLAttributes, ReactNode } from 'react'

type RoundIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export function RoundIconButton({
  children,
  className = '',
  type = 'button',
  ...props
}: RoundIconButtonProps) {
  return (
    <button
      type={type}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-bloom-rose/25 bg-surface text-bloom-ink/70 shadow-sm transition hover:border-brand-pink/40 hover:text-bloom-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
