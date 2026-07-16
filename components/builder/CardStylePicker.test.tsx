import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CardStylePicker } from '@/components/builder/CardStylePicker'
import { ToastProvider } from '@/components/ui/Toast'
import { SURPRISE_CARD_IDS } from '@/lib/cards'

function renderPicker(props: Partial<React.ComponentProps<typeof CardStylePicker>> = {}) {
  return render(
    <ToastProvider>
      <CardStylePicker selectedId="classic-cream" onSelect={vi.fn()} {...props} />
    </ToastProvider>
  )
}

describe('CardStylePicker', () => {
  it('renders nine note themes: eight in grid and one featured', () => {
    renderPicker()

    expect(screen.getByText('Most loved this week')).toBeInTheDocument()
    expect(screen.getByText('Blush')).toBeInTheDocument()
    expect(screen.getByText('Linen')).toBeInTheDocument()
    expect(screen.queryByText('Photo Card')).not.toBeInTheDocument()
    expect(screen.getByTestId('surprise-me-button')).toBeInTheDocument()
    expect(screen.getAllByTestId('message-card')).toHaveLength(9)
    expect(screen.queryByTestId('photo-card-upload')).not.toBeInTheDocument()
  })

  it('selects a style when a card is clicked', () => {
    const onSelect = vi.fn()
    renderPicker({ onSelect })

    fireEvent.click(screen.getByTestId('card-midnight'))
    expect(onSelect).toHaveBeenCalledWith('midnight')
  })

  it('shows a shared romantic signature on note previews', () => {
    renderPicker()

    const preview = screen.getAllByTestId('message-card')[0]
    expect(preview).toHaveTextContent('With love, your favorite softie')
  })

  it('does not duplicate With love in previews', () => {
    renderPicker()

    const preview = screen.getAllByTestId('message-card')[0]
    expect(preview).toHaveTextContent('With love')
    expect(preview).not.toHaveTextContent('With love, With love')
  })

  it('shows checkmark on selected style', () => {
    renderPicker({ selectedId: 'watercolor' })

    expect(screen.getByTestId('card-check-watercolor')).toBeInTheDocument()
  })

  it('surprise pool contains only note card ids', () => {
    expect(SURPRISE_CARD_IDS).not.toContain('photo-card')
  })
})
