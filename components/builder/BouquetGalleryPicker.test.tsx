import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { BouquetGalleryPicker } from '@/components/builder/BouquetGalleryPicker'

describe('BouquetGalleryPicker', () => {
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
      'Twelve deep red roses',
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
      within(dialog).getByText('Twelve deep red roses, wrapped in kraft paper.'),
    ).toBeInTheDocument()
    expect(
      within(dialog).getByText(
        'The bouquet that needs no translation. Love, plainly spoken.',
      ),
    ).toBeInTheDocument()
  })
})
