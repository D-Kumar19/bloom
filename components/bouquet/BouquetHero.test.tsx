import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BouquetHero } from '@/components/bouquet/BouquetHero'
import { BOUQUETS } from '@/lib/bouquets'

describe('BouquetHero', () => {
  it('renders the hero image for a known bouquet', () => {
    render(<BouquetHero bouquetId="sunflower-burst" theme="warm" showBackdrop={false} />)

    expect(screen.getByTestId('hanging-bouquet-scene')).toBeInTheDocument()
    expect(screen.getByTestId('bouquet-hero')).toBeInTheDocument()
    expect(screen.getByAltText('Sunflower Burst')).toBeInTheDocument()
  })

  it('falls back to the default bouquet when id is unknown', () => {
    render(<BouquetHero bouquetId="missing-bouquet" theme="warm" showBackdrop={false} />)

    expect(screen.getByAltText('Red Rose Classic')).toBeInTheDocument()
  })

  it('mounts the complete portrait without cropping or distorting it', () => {
    render(
      <BouquetHero bouquetId="blush-peony-cloud" theme="warm" showBackdrop={false} presentation="flat" />,
    )

    expect(screen.getByTestId('bouquet-hero')).toHaveClass('bloom-artwork')
    expect(screen.getByAltText('Blush Peony Cloud')).toHaveClass('object-contain', 'h-auto')
    expect(screen.getByAltText('Blush Peony Cloud')).toHaveAttribute('width', '1024')
    expect(screen.getByAltText('Blush Peony Cloud')).toHaveAttribute('height', '1536')
  })

  it.each(BOUQUETS)('preserves the full artwork for $name', (bouquet) => {
    render(
      <BouquetHero bouquetId={bouquet.id} theme="midnight" showBackdrop={false} presentation="flat" />,
    )

    const image = screen.getByAltText(bouquet.name)
    expect(image).toHaveAttribute('src', bouquet.heroImage)
    expect(image).toHaveClass('object-contain', 'h-auto')
    expect(image).not.toHaveClass('object-cover')
  })
})
