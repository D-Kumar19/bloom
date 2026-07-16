import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BouquetHero } from '@/components/bouquet/BouquetHero'

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
})
