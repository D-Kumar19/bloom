import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BouquetGalleryPicker } from '@/components/builder/BouquetGalleryPicker'
import { BOUQUET_MEANING_NOTE, getBouquetById } from '@/lib/bouquets'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

describe('BouquetGalleryPicker', () => {
  beforeEach(() => {
    push.mockReset()
  })
  it('opens the selected bouquet mood when returning to the picker', () => {
    render(<BouquetGalleryPicker selectedId="sunflower-burst" onSelect={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Celebration' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByTestId('bouquet-selected-summary')).toHaveTextContent('Sunflower Burst')
  })

  it('supports arrow, Home and End navigation with one tab stop', () => {
    render(<BouquetGalleryPicker selectedId="red-rose-classic" onSelect={vi.fn()} />)
    const romantic = screen.getByRole('tab', { name: 'Romantic' })
    fireEvent.keyDown(romantic, { key: 'ArrowLeft' })
    const justBecause = screen.getByRole('tab', { name: 'Just Because' })
    expect(justBecause).toHaveFocus()
    expect(justBecause).toHaveAttribute('tabindex', '0')
    expect(romantic).toHaveAttribute('tabindex', '-1')
    fireEvent.keyDown(justBecause, { key: 'Home' })
    expect(romantic).toHaveFocus()
    fireEvent.keyDown(romantic, { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'Celebration' })).toHaveFocus()
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Celebration' }), { key: 'End' })
    expect(justBecause).toHaveFocus()
    expect(screen.getByRole('tabpanel', { name: 'Just Because' })).toBeInTheDocument()
  })

  it('filters bouquets by mood tab', () => {
    render(
      <BouquetGalleryPicker
        selectedId="red-rose-classic"
        onSelect={vi.fn()}
      />,
    )

    expect(screen.getByTestId('bouquet-tile-red-rose-classic')).toBeInTheDocument()
    expect(screen.queryByTestId('bouquet-tile-sunflower-burst')).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('bouquet-mood-celebration'))

    expect(screen.getByTestId('bouquet-tile-sunflower-burst')).toBeInTheDocument()
    expect(screen.queryByTestId('bouquet-tile-red-rose-classic')).not.toBeInTheDocument()
  })

  it('shows the selected bouquet summary only on its mood tab', () => {
    render(
      <BouquetGalleryPicker
        selectedId="red-rose-classic"
        onSelect={vi.fn()}
      />,
    )

    expect(screen.getByTestId('bouquet-selected-summary')).toHaveTextContent('Red Rose Classic')
    expect(screen.getByTestId('bouquet-selected-summary')).toHaveTextContent(
      'Deep red roses',
    )

    fireEvent.click(screen.getByTestId('bouquet-mood-celebration'))

    expect(screen.queryByTestId('bouquet-selected-summary')).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('bouquet-mood-romantic'))

    expect(screen.getByTestId('bouquet-selected-summary')).toHaveTextContent('Red Rose Classic')
  })

  it('calls onSelect when a bouquet is selected', () => {
    const onSelect = vi.fn()
    render(
      <BouquetGalleryPicker
        selectedId="red-rose-classic"
        onSelect={onSelect}
      />,
    )

    fireEvent.click(screen.getByTestId('bouquet-select-blush-peony-cloud'))
    expect(onSelect).toHaveBeenCalledWith('blush-peony-cloud')
  })

  it('opens detail modal with bouquet name and tagline', () => {
    render(
      <BouquetGalleryPicker
        selectedId="red-rose-classic"
        onSelect={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByTestId('bouquet-image-red-rose-classic'))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(
      within(dialog).getByText('Deep red roses, green leaves, and a warm paper wrap.'),
    ).toBeInTheDocument()
    expect(
      within(dialog).getByText(/Steady affection/),
    ).toBeInTheDocument()
    expect(within(dialog).getByText('A thought for:')).toBeInTheDocument()
    expect(within(dialog).getByText(BOUQUET_MEANING_NOTE)).toBeInTheDocument()
    expect(
      within(dialog).getByText('Anniversaries, Valentine\'s Day, and "I still choose you" messages'),
    ).toBeInTheDocument()
    for (const detail of getBouquetById('red-rose-classic')!.facts) {
      expect(within(dialog).getByText(detail)).toBeInTheDocument()
    }
    expect(within(dialog).getByAltText('Red Rose Classic')).toHaveClass('object-contain')
    expect(within(dialog).getByAltText('Red Rose Classic')).toHaveAttribute('src', '/bouquets/red-rose-classic-hero.png')
  })

  it('closes the detail modal when the backdrop is clicked', () => {
    render(
      <BouquetGalleryPicker
        selectedId="red-rose-classic"
        onSelect={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByTestId('bouquet-image-red-rose-classic'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(push).not.toHaveBeenCalled()
  })

  it('closes the detail modal without leaving create when Close is clicked', () => {
    render(
      <BouquetGalleryPicker
        selectedId="red-rose-classic"
        onSelect={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByTestId('bouquet-image-red-rose-classic'))
    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(push).not.toHaveBeenCalled()
  })
})
