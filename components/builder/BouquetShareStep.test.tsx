import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { BouquetShareStep } from '@/components/builder/BouquetShareStep'
import { DEFAULT_BOUQUET_ID } from '@/lib/bouquets'

vi.mock('@/components/bouquet/SoundtrackPlayer', () => ({
  SoundtrackPlayer: () => <div data-testid="soundtrack-inline" />,
}))

vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}))

const baseState = {
  bouquetId: DEFAULT_BOUQUET_ID,
  cardStyle: 'classic-cream',
  to: 'Alex',
  message: 'Thinking of you',
  from: 'Sam',
  theme: 'cherry',
  soundtrack: 'rain',
}

describe('BouquetShareStep', () => {
  it('renders the themed recipient preview backdrop and soundtrack player', () => {
    render(<BouquetShareStep state={baseState} onCreateAnother={vi.fn()} />)

    expect(screen.getByTestId('share-reveal-backdrop')).toBeInTheDocument()
    expect(screen.getByTestId('bouquet-hero')).toBeInTheDocument()
    expect(screen.getByTestId('soundtrack-inline')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'preview as recipient' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/bouquet\?b=.+&preview=1$/),
    )
  })
})
