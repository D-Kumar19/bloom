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
        className={className}
        id={id}
      />
    )
  }

  const image = (
    <div
      id={id}
      data-testid="bouquet-hero"
      className="bloom-artwork relative mx-auto w-full max-w-md"
    >
      <Image
        src={bouquet.heroImage}
        alt={bouquet.name}
        width={1024}
        height={1536}
        unoptimized
        priority
        sizes="(max-width: 768px) 100vw, 448px"
        className="block h-auto w-full object-contain"
      />
    </div>
  )

  if (!showBackdrop) {
    return <div className={`relative ${className}`}>{image}</div>
  }

  return (
    <BackdropLayer
      theme={theme}
      className={`mx-auto w-full max-w-md ${className}`}
    >
      {image}
    </BackdropLayer>
  )
}
