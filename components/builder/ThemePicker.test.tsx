import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ThemePicker } from '@/components/builder/ThemePicker'

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
      screen.getByText(/Tap a swatch to learn more/i),
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
