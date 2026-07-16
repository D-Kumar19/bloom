'use client'

import { BloomLogo } from '@/components/ui/BloomLogo'
import { BouquetCounter } from '@/components/landing/BouquetCounter'
import { FOOTER_TAGLINE } from '@/lib/site'

type FooterBrandProps = {
  initialCount: number
}

export function FooterBrand({ initialCount }: FooterBrandProps) {
  return (
    <div className="space-y-4">
      <BloomLogo />
      <p className="max-w-xs text-sm leading-relaxed text-bloom-ink/70">
        {FOOTER_TAGLINE}
      </p>
      <BouquetCounter initialCount={initialCount} compact />
    </div>
  )
}
