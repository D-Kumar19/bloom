import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { GiftComposition } from '@/components/bouquet/GiftComposition'
import type { BouquetState } from '@/lib/types'

const bouquet: BouquetState = {
  bouquetId: 'eucalyptus-and-white', cardStyle: 'midnight', theme: 'midnight',
  to: 'Mira', from: 'Jules', message: '<b>Here for you.</b><br>No need to reply.',
  noteBorder: { style: 'double', color: '#ffffff' },
}

describe('GiftComposition', () => {
  it('pairs an uncropped photograph with the actual selected note and border', () => {
    render(<GiftComposition bouquet={bouquet} />)
    expect(screen.getByTestId('gift-composition')).toHaveClass('gift-composition--paired')
    expect(screen.getByAltText('Eucalyptus and White')).toHaveClass('object-contain')
    expect(screen.getByTestId('message-card')).toHaveStyle({ borderStyle: 'double' })
    expect(screen.getByTestId('formatted-message-body').innerHTML).toContain('<b>Here for you.</b><br>')
    expect(screen.getByTestId('formatted-message-body')).toHaveStyle({ color: '#ffffff' })
  })

  it('does not invent a note for a blank legacy gift', () => {
    render(<GiftComposition bouquet={{ ...bouquet, message: '' }} />)
    expect(screen.queryByTestId('message-card')).not.toBeInTheDocument()
    expect(screen.getByTestId('gift-composition')).not.toHaveClass('gift-composition--paired')
  })

  it('renders the closed note without nesting interactive roles in the reveal', () => {
    render(<GiftComposition bouquet={bouquet} folded />)
    expect(screen.getByTestId('message-card-folded')).not.toHaveAttribute('role')
    expect(screen.getByTestId('message-card-folded')).not.toHaveAttribute('tabindex')
    expect(screen.queryByText('Here for you.')).not.toBeInTheDocument()
  })
})
