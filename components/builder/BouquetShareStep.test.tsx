import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { BouquetShareStep } from '@/components/builder/BouquetShareStep'
import { DEFAULT_BOUQUET_ID } from '@/lib/bouquets'
import { recordBouquetSentOnce } from '@/lib/counter/recordBouquetSent'

vi.mock('@/lib/counter/recordBouquetSent', () => ({
  recordBouquetSentOnce: vi.fn(() => new Promise<void>(() => {})),
}))

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
    expect(screen.getByRole('link', { name: 'Happy with your gift? Jump to sharing' })).toHaveAttribute('href', '#share-actions')
    expect(screen.getByRole('region', { name: 'Share your bouquet' })).toHaveAttribute('id', 'share-actions')
    expect(
      screen.getByRole('link', { name: 'preview as recipient' })
    ).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/bouquet\?b=.+&preview=1$/)
    )
  })

  it('confirms both clipboard actions without waiting on a stalled counter', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    render(<BouquetShareStep state={baseState} onCreateAnother={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy message + link' }))
    await waitFor(() =>
      expect(screen.getByTestId('copy-share-button')).toHaveTextContent(
        'Copied!'
      )
    )
    expect(screen.getByTestId('copy-share-button')).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: 'Copy link only' }))
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(2))
    expect(recordBouquetSentOnce).toHaveBeenCalledTimes(2)
  })

  it('does not count viewing a preview or a failed clipboard write', async () => {
    vi.mocked(recordBouquetSentOnce).mockClear()
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('Clipboard blocked')) },
    })
    render(<BouquetShareStep state={baseState} onCreateAnother={vi.fn()} />)
    expect(recordBouquetSentOnce).not.toHaveBeenCalled()
    fireEvent.click(screen.getByTestId('copy-link-button'))
    await waitFor(() => expect(screen.getByTestId('copy-link-button')).toBeEnabled())
    expect(recordBouquetSentOnce).not.toHaveBeenCalled()
  })
})
