import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BouquetExportSnapshot } from '@/components/bouquet/BouquetExportSnapshot'
import type { BouquetState } from '@/lib/types'

const bouquetWithNote: BouquetState = {
  bouquetId: 'red-rose-classic',
  cardStyle: 'classic-cream',
  to: 'Alex',
  message: 'Thinking of you today.',
  from: 'Sam',
  theme: 'warm',
}

const bouquetWithoutNote: BouquetState = {
  bouquetId: 'red-rose-classic',
  cardStyle: 'classic-cream',
  to: 'Alex',
  message: '',
  from: 'Sam',
  theme: 'warm',
}

describe('BouquetExportSnapshot', () => {
  it('renders bouquet and note together for export', () => {
    render(<BouquetExportSnapshot bouquet={bouquetWithNote} />)

    const snapshot = screen.getByTestId('bouquet-export-snapshot')
    expect(snapshot).toHaveClass('export-static')
    expect(screen.getByAltText('Red Rose Classic')).toHaveAttribute(
      'src',
      '/bouquets/red-rose-classic-hero.png',
    )
    expect(screen.getByTestId('message-card')).toBeInTheDocument()
    expect(screen.getByText('Thinking of you today.')).toBeInTheDocument()
  })

  it('renders bouquet only when there is no note', () => {
    render(<BouquetExportSnapshot bouquet={bouquetWithoutNote} />)

    expect(screen.getByAltText('Red Rose Classic')).toBeInTheDocument()
    expect(screen.queryByTestId('message-card')).not.toBeInTheDocument()
  })
})
