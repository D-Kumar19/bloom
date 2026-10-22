import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BouquetViewer } from '@/app/bouquet/BouquetViewer'
import { ToastProvider } from '@/components/ui/Toast'
import { encodeBouquet } from '@/lib/sharing'
import type { BouquetState } from '@/lib/types'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const bouquet: BouquetState = {
  bouquetId: 'blush-peony-cloud',
  cardStyle: 'classic-cream',
  theme: 'warm',
  to: 'Mira',
  from: 'Jules',
  message: 'A little color for your day.',
  soundtrack: 'none',
}

function renderGift(state = bouquet) {
  window.history.replaceState(null, '', `/bouquet?b=${encodeBouquet(state)}`)
  return render(<ToastProvider><BouquetViewer /></ToastProvider>)
}

describe('redesigned recipient opening', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/bouquet')
  })

  it('opens the complete gift immediately without nesting the skip action in the reveal button', async () => {
    renderGift()
    const skip = await screen.findByRole('button', { name: 'Open everything now' })
    const stage = screen.getByTestId('reveal-stage')
    expect(stage).not.toContainElement(skip)

    fireEvent.click(skip)

    expect(stage).not.toHaveAttribute('role')
    expect(stage).not.toHaveAttribute('tabindex')
    expect(screen.getByText(bouquet.message)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save as Image' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Open everything now' })).not.toBeInTheDocument()
  })

  it('keeps the staged reveal keyboard-operable and displays the mounted portrait', async () => {
    renderGift()
    const stage = await screen.findByRole('button', { name: 'Tap to continue the reveal' })

    fireEvent.keyDown(stage, { key: 'Enter' })
    expect(screen.getByAltText('Blush Peony Cloud')).toHaveClass('object-contain')
    expect(screen.queryByTestId('message-card')).not.toBeInTheDocument()

    fireEvent.keyDown(stage, { key: ' ' })
    expect(screen.getByTestId('message-card-folded')).not.toHaveAttribute('role')

    fireEvent.keyDown(stage, { key: 'Enter' })
    expect(screen.getByText(bouquet.message)).toBeInTheDocument()
    expect(stage).not.toHaveAttribute('role')
  })

  it('opens an old flower-only gift without inventing a note', async () => {
    renderGift({ ...bouquet, message: '' })
    fireEvent.click(await screen.findByRole('button', { name: 'Open everything now' }))

    expect(screen.getByAltText('Blush Peony Cloud')).toBeInTheDocument()
    expect(screen.queryByTestId('message-card')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save as Image' })).toBeInTheDocument()
  })
})
