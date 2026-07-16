import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ThemePicker } from '@/components/builder/ThemePicker'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

const onSelect = vi.fn()
const onSoundtrackSelect = vi.fn()
const playAmbient = vi.fn()

vi.mock('@/hooks/useAmbientSoundtrack', () => ({
  useAmbientSoundtrack: () => ({
    playingId: null,
    play: playAmbient,
    stop: vi.fn(),
    isPlaying: () => false,
  }),
}))

describe('ThemePicker', () => {
  beforeEach(() => {
    onSelect.mockReset()
    onSoundtrackSelect.mockReset()
    playAmbient.mockReset()
    push.mockReset()
  })

  it('renders the backdrop headline and helper copy', () => {
    render(
      <ThemePicker
        selectedId="warm"
        soundtrackId="none"
        onSelect={onSelect}
        onSoundtrackSelect={onSoundtrackSelect}
      />,
    )

    expect(screen.getByText('Choose your backdrop')).toBeInTheDocument()
    expect(
      screen.getByText(/Tap a swatch for details/i),
    ).toBeInTheDocument()
  })

  it('does not show the bouquet composition preview', () => {
    render(
      <ThemePicker
        selectedId="warm"
        soundtrackId="none"
        onSelect={onSelect}
        onSoundtrackSelect={onSoundtrackSelect}
      />,
    )

    expect(screen.queryByTestId('bouquet-composition')).not.toBeInTheDocument()
  })

  it('shows animated badge only on animated backdrops', () => {
    render(
      <ThemePicker
        selectedId="warm"
        soundtrackId="none"
        onSelect={onSelect}
        onSoundtrackSelect={onSoundtrackSelect}
      />,
    )

    expect(screen.queryByText('Tap to learn')).not.toBeInTheDocument()
    expect(screen.getByTestId('theme-animated-badge-sunset')).toBeInTheDocument()
    expect(screen.getByTestId('theme-animated-badge-sage')).toBeInTheDocument()
    expect(screen.queryByTestId('theme-animated-badge-ocean')).not.toBeInTheDocument()
    expect(screen.queryByTestId('theme-animated-badge-warm')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('theme-decorations').length).toBeGreaterThan(0)
  })

  it('opens a detail modal when a backdrop swatch is tapped', () => {
    render(
      <ThemePicker
        selectedId="warm"
        soundtrackId="none"
        onSelect={onSelect}
        onSoundtrackSelect={onSoundtrackSelect}
      />,
    )

    fireEvent.click(screen.getByTestId('theme-ocean'))

    expect(screen.getByRole('heading', { name: 'Ocean Breeze' })).toBeInTheDocument()
    expect(screen.getByText(/Cool blue air that steadies the heart/i)).toBeInTheDocument()
  })

  it('selects a backdrop from the card action', () => {
    render(
      <ThemePicker
        selectedId="warm"
        soundtrackId="none"
        onSelect={onSelect}
        onSoundtrackSelect={onSoundtrackSelect}
      />,
    )

    fireEvent.click(screen.getByTestId('theme-select-sunset'))

    expect(onSelect).toHaveBeenCalledWith('sunset')
  })

  it('selects and previews ambient sound on click', () => {
    render(
      <ThemePicker
        selectedId="warm"
        soundtrackId="none"
        onSelect={onSelect}
        onSoundtrackSelect={onSoundtrackSelect}
      />,
    )

    fireEvent.click(screen.getByTestId('soundtrack-rain'))

    expect(onSoundtrackSelect).toHaveBeenCalledWith('rain')
    expect(playAmbient).toHaveBeenCalledWith('rain')
  })
})
