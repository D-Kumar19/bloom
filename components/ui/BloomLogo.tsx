import Link from 'next/link'

type BloomLogoProps = {
  className?: string
  showWordmark?: boolean
}

export function BloomLogo({ className = '', showWordmark = true }: BloomLogoProps) {
  return (
    <Link
      href="/"
      className={`group flex shrink-0 items-center gap-3 ${className}`}
      data-testid="site-logo"
      aria-label="Bloom home"
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-pink/10 ring-1 ring-brand-pink/15 transition duration-300 group-hover:bg-brand-pink/15 group-hover:ring-brand-pink/25">
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          className="transition duration-300 group-hover:scale-105"
        >
          <path
            d="M11 4.5c-1.4 2.4-2.8 4.6-2.8 7a2.8 2.8 0 0 0 5.6 0c0-2.4-1.4-4.6-2.8-7z"
            className="fill-brand-pink"
          />
          <path
            d="M7.5 13.5c1.8-.8 2.6-2.2 2.6-3.8"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-brand-pink-dark/60"
          />
          <path
            d="M14.5 13.5c-1.8-.8-2.6-2.2-2.6-3.8"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-brand-pink-dark/60"
          />
          <path
            d="M11 15.5v2.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="text-bloom-sage"
          />
        </svg>
      </span>
      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.4rem] tracking-tight text-bloom-ink">
            Bloom
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-bloom-ink/72">
            bouquets
          </span>
        </span>
      ) : null}
    </Link>
  )
}
