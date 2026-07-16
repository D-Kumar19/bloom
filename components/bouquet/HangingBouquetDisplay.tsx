'use client'

import Image from 'next/image'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { DEFAULT_BOUQUET_ID, getBouquetById } from '@/lib/bouquets'

type HangingBouquetDisplayProps = {
  bouquetId: string
  themeId: string
  className?: string
  id?: string
}

export function HangingBouquetDisplay({
  bouquetId,
  themeId: _themeId,
  className = '',
  id,
}: HangingBouquetDisplayProps) {
  const bouquet = getBouquetById(bouquetId) ?? getBouquetById(DEFAULT_BOUQUET_ID)
  const reducedMotion = usePrefersReducedMotion()

  if (!bouquet) {
    return null
  }

  const swayClass = reducedMotion ? '' : 'animate-hanging-sway'

  return (
    <div
      data-testid="hanging-bouquet-scene"
      className={`relative mx-auto w-full max-w-lg px-2 ${className}`}
    >
      <div className={`relative mx-auto w-full max-w-[17.5rem] sm:max-w-[19rem] ${swayClass}`}>
        <div
          id={id}
          data-testid="bouquet-hero"
          className="relative mx-auto w-fit -rotate-2 rounded-[1.75rem] bg-white/95 p-2.5 shadow-[0_20px_50px_-12px_rgba(42,36,32,0.35)] ring-1 ring-white/80"
        >
          <div className="relative aspect-[4/5] w-[15.5rem] overflow-hidden rounded-2xl sm:w-[17rem]">
            <Image
              src={bouquet.heroImage}
              alt={bouquet.name}
              fill
              unoptimized
              priority
              sizes="(max-width: 768px) 70vw, 272px"
              className="object-cover"
            />
          </div>
          <p className="mt-2 text-center font-display text-sm text-[#2a2420]/80">
            {bouquet.name}
          </p>
        </div>
      </div>
    </div>
  )
}
