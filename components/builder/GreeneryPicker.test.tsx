import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { GreeneryPicker } from '@/components/builder/GreeneryPicker'

describe('GreeneryPicker', () => {
  it('renders six foliage options and selects via Select button', () => {
    const onSelect = vi.fn()

    render(<GreeneryPicker selectedId="leafy" onSelect={onSelect} />)

    expect(screen.getByText('Choose your foliage')).toBeInTheDocument()
    expect(screen.getByText('Lush Leaves')).toBeInTheDocument()
    expect(screen.getByText("Baby's Breath")).toBeInTheDocument()
    expect(screen.getByText('Olive Branch')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('greenery-select-fern'))
    expect(onSelect).toHaveBeenCalledWith('fern')
  })

  it('opens tap-to-learn modal from image without selecting', () => {
    const onSelect = vi.fn()

    render(<GreeneryPicker selectedId="leafy" onSelect={onSelect} />)

    fireEvent.click(screen.getByTestId('greenery-image-eucalyptus'))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Eucalyptus', level: 2 })).toBeInTheDocument()
    expect(screen.getByText(/Did you know\?/)).toBeInTheDocument()
    expect(screen.getByText(/Perfect for:/)).toBeInTheDocument()
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('selects from the learn modal', () => {
    const onSelect = vi.fn()

    render(<GreeneryPicker selectedId="leafy" onSelect={onSelect} />)

    fireEvent.click(screen.getByTestId('greenery-image-olive'))
    fireEvent.click(screen.getByTestId('greenery-modal-select'))

    expect(onSelect).toHaveBeenCalledWith('olive')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows selected state on card and in modal', () => {
    render(<GreeneryPicker selectedId="willow" onSelect={vi.fn()} />)

    expect(screen.getByTestId('greenery-select-willow')).toHaveTextContent('✓ Selected')

    fireEvent.click(screen.getByTestId('greenery-image-willow'))

    expect(screen.getByText('✓ Selected for your bouquet')).toBeInTheDocument()
  })

  it('shows copyright footer', () => {
    render(<GreeneryPicker selectedId="leafy" onSelect={vi.fn()} />)

    expect(screen.getByText(/belong to Bloom/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute(
      'href',
      '/privacy',
    )
  })
})
