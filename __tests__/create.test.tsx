import { fireEvent, render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { FlowerPicker } from '@/components/builder/FlowerPicker'
import { ToastProvider } from '@/components/ui/Toast'

function renderPicker(props: ComponentProps<typeof FlowerPicker>) {
  return render(
    <ToastProvider>
      <FlowerPicker {...props} />
    </ToastProvider>
  )
}

describe('FlowerPicker', () => {
  it('calls onAdjustQuantity when + is clicked', () => {
    const onAdjustQuantity = vi.fn()
    renderPicker({ selected: [], onAdjustQuantity })

    const roseCard = screen.getByTestId('flower-card-rose')
    const addButton = roseCard.querySelector('button[aria-label="increase"]')
    expect(addButton).toBeTruthy()
    fireEvent.click(addButton!)
    expect(onAdjustQuantity).toHaveBeenCalledWith('rose', 1)
  })

  it('shows quantity for selected flowers', () => {
    renderPicker({
      selected: ['rose', 'rose', 'tulip'],
      onAdjustQuantity: vi.fn(),
    })

    expect(screen.getByTestId('flower-qty-rose')).toHaveTextContent('2')
    expect(screen.getByTestId('flower-qty-tulip')).toHaveTextContent('1')
  })

  it('opens detail modal when flower image is clicked', () => {
    renderPicker({ selected: [], onAdjustQuantity: vi.fn() })

    fireEvent.click(screen.getByTestId('flower-image-rose'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Did you know?')).toBeInTheDocument()
    expect(screen.getByText('Perfect for:')).toBeInTheDocument()
    expect(
      screen.getByText(/Romance, anniversaries, Valentine's Day/)
    ).toBeInTheDocument()
  })

  it('shows toast when bouquet is at max', () => {
    const flowerIds = [
      'rose',
      'peony',
      'tulip',
      'daisy',
      'lily',
      'orchid',
      'camellia',
      'lotus',
      'sunflower',
      'lavender',
      'carnation',
      'cherry-blossom',
    ]
    const flowers = Array.from({ length: 20 }, (_, i) => flowerIds[i % flowerIds.length])
    renderPicker({ selected: flowers, onAdjustQuantity: vi.fn() })

    const tulipCard = screen.getByTestId('flower-card-tulip')
    const addButton = tulipCard.querySelector(
      'button[aria-label="increase"]'
    ) as HTMLButtonElement
    fireEvent.click(addButton)
    expect(screen.getByRole('status')).toHaveTextContent(
      'Your bouquet is full (20 flowers max).'
    )
  })

  it('allows adding more than 5 of the same flower while under the total limit', () => {
    const flowers = Array.from({ length: 5 }, () => 'rose')
    const onAdjustQuantity = vi.fn()
    renderPicker({ selected: flowers, onAdjustQuantity })

    const roseCard = screen.getByTestId('flower-card-rose')
    const addButton = roseCard.querySelector(
      'button[aria-label="increase"]'
    ) as HTMLButtonElement
    fireEvent.click(addButton)
    expect(onAdjustQuantity).toHaveBeenCalledWith('rose', 1)
  })

  it('shows bouquet count in modal when flower is selected', () => {
    renderPicker({
      selected: ['camellia', 'camellia', 'camellia'],
      onAdjustQuantity: vi.fn(),
    })

    fireEvent.click(screen.getByTestId('flower-image-camellia'))
    expect(screen.getByText(/3 in your bouquet/)).toBeInTheDocument()
  })
})
