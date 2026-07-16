import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BouquetGalleryPicker } from '@/components/builder/BouquetGalleryPicker'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

describe('BouquetGalleryPicker', () => {
  beforeEach(() => {
    push.mockReset()
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
    expect(within(dialog).getByText('Perfect for:')).toBeInTheDocument()
    expect(
      within(dialog).getByText('Anniversaries, Valentine\'s Day, and "I still choose you" messages'),
    ).toBeInTheDocument()
    expect(within(dialog).getByText('12 long-stem red roses')).toBeInTheDocument()
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
