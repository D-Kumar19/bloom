import Link from 'next/link'
import Image from 'next/image'

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
        <Image
          src="/icon.svg"
          alt=""
          width={40}
          height={40}
          unoptimized
          aria-hidden
          className="transition duration-300 group-hover:scale-105"
        />
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
