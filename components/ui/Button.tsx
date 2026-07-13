import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonBaseProps = {
  variant?: ButtonVariant
  className?: string
  children?: ReactNode
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined
  }

type ButtonAsLink = ButtonBaseProps & {
  href: string
}

type ButtonProps = ButtonAsButton | ButtonAsLink

export const buttonClassName = (
  variant: ButtonVariant = 'primary',
  className = ''
) =>
  `inline-flex min-h-11 items-center justify-center rounded-2xl px-6 py-2.5 text-sm font-semibold transition-colors ${variantClasses[variant]} ${className}`

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-pink text-white hover:bg-brand-pink-dark disabled:bg-[#D4D4D4] disabled:text-[#888] disabled:cursor-not-allowed',
  secondary:
    'bg-bloom-sage text-bloom-ink hover:bg-bloom-sage/90 disabled:bg-[#D4D4D4] disabled:cursor-not-allowed',
  ghost:
    'border border-bloom-rose/30 bg-transparent text-bloom-ink hover:bg-bloom-rose/10 disabled:opacity-50 disabled:cursor-not-allowed',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = buttonClassName(variant, className)

  if ('href' in props && props.href) {
    const { href } = props
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  const { type = 'button', ...buttonProps } = props as ButtonAsButton

  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
