import Image from 'next/image'

import { BackdropLayer } from '@/components/backdrop/BackdropLayer'
import { HangingBouquetDisplay } from '@/components/bouquet/HangingBouquetDisplay'
import { DEFAULT_BOUQUET_ID, getBouquetById } from '@/lib/bouquets'

type BouquetHeroProps = {
  bouquetId: string
  theme: string
  className?: string
  id?: string
  showBackdrop?: boolean
  presentation?: 'hanging' | 'flat'
}

export function BouquetHero({
  bouquetId,
  theme,
  className = '',
  id,
  showBackdrop = true,
  presentation = 'hanging',
}: BouquetHeroProps) {
  const bouquet = getBouquetById(bouquetId) ?? getBouquetById(DEFAULT_BOUQUET_ID)
  if (!bouquet) {
    return null
  }

  if (presentation === 'hanging' && !showBackdrop) {
    return (
      <HangingBouquetDisplay
        bouquetId={bouquetId}
        themeId={theme}
        className={className}
        id={id}
      />
    )
  }

  const image = (
    <div
      id={id}
      data-testid="bouquet-hero"
      className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl"
    >
      <Image
        src={bouquet.heroImage}
        alt={bouquet.name}
        fill
        unoptimized
        priority
        sizes="(max-width: 768px) 100vw, 448px"
        className="object-cover"
      />
    </div>
  )

  if (!showBackdrop) {
    return <div className={`relative overflow-hidden rounded-3xl ${className}`}>{image}</div>
  }

  return (
    <BackdropLayer
      theme={theme}
      className={`mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl ${className}`}
    >
      {image}
    </BackdropLayer>
  )
}
