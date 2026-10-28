import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonBaseProps = {
  variant?: ButtonVariant
  className?: string
  children?: ReactNode
  magical?: boolean
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined
  }

type ButtonAsLink = ButtonBaseProps & {
  href: string
  onClick?: () => void
}

type ButtonProps = ButtonAsButton | ButtonAsLink

export const buttonClassName = (
  variant: ButtonVariant = 'primary',
  className = ''
) =>
  `inline-flex min-h-11 items-center justify-center rounded-2xl px-6 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bloom-ink ${variantClasses[variant]} ${className}`

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-action-rose text-white hover:bg-action-rose-hover disabled:bg-[#D4D4D4] disabled:text-[#666] disabled:cursor-not-allowed',
  secondary:
    'bg-bloom-sage text-[#2a2420] hover:bg-bloom-sage/90 disabled:bg-[#D4D4D4] disabled:cursor-not-allowed',
  ghost:
    'border border-bloom-rose/30 bg-transparent text-bloom-ink hover:bg-bloom-rose/10 disabled:opacity-50 disabled:cursor-not-allowed',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  magical = false,
  ...props
}: ButtonProps) {
  const classes = buttonClassName(variant, `${magical ? 'bloom-magic-action' : ''} ${className}`)

  if ('href' in props && props.href) {
    const { href, onClick } = props
    return (
      <Link href={href} className={classes} onClick={onClick}>
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
