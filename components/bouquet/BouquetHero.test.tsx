import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BouquetHero } from '@/components/bouquet/BouquetHero'
import { BOUQUETS } from '@/lib/bouquets'

describe('BouquetHero', () => {
  it.each(BOUQUETS)('keeps the full $name portrait and the rounded hanging presentation', (bouquet) => {
    render(<BouquetHero bouquetId={bouquet.id} theme="warm" showBackdrop={false} />)
    expect(screen.getByTestId('hanging-bouquet-scene')).toBeInTheDocument()
    expect(screen.getByTestId('bouquet-hero')).toHaveClass('w-full', 'max-w-[16.75rem]')
    expect(screen.getByAltText(bouquet.name)).toHaveClass('object-contain')
    expect(screen.getByAltText(bouquet.name)).toHaveAttribute('src', bouquet.heroImage)
  })

  it('preserves the original portrait dimensions in the flat detail/export view', () => {
    render(<BouquetHero bouquetId="blush-peony-cloud" theme="warm" showBackdrop={false} presentation="flat" />)
    const image = screen.getByAltText('Blush Peony Cloud')
    expect(image).toHaveClass('h-auto', 'object-contain')
    expect(image).toHaveAttribute('width', '1024')
    expect(image).toHaveAttribute('height', '1536')
    expect(screen.getByTestId('bouquet-hero')).toHaveClass('rounded-3xl')
  })
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
})
