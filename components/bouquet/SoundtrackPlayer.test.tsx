import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SoundtrackPlayer, type SoundtrackPlayerHandle } from '@/components/bouquet/SoundtrackPlayer'

const play = vi.fn()
const stop = vi.fn()

vi.mock('@/hooks/useAmbientSoundtrack', () => ({
  useAmbientSoundtrack: () => ({
    play,
    stop,
    isPlaying: (id: string) => id === 'rain',
  }),
}))

describe('SoundtrackPlayer', () => {
  beforeEach(() => {
    play.mockClear()
    stop.mockClear()
  })

  it('renders nothing when soundtrack is none', () => {
    const { container } = render(<SoundtrackPlayer soundtrackId="none" autoPlay />)
    expect(container).toBeEmptyDOMElement()
  })

  it('autoplays and mutes immediately on click', () => {
    render(<SoundtrackPlayer soundtrackId="rain" autoPlay variant="inline" />)

    expect(play).toHaveBeenCalledWith('rain')
    expect(screen.getByTestId('soundtrack-inline')).toBeInTheDocument()
    expect(screen.getByText(/is playing\. Tap to mute\./i)).toBeInTheDocument()
    expect(screen.getByTestId('soundtrack-toggle')).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByTestId('soundtrack-toggle'))

    expect(stop).toHaveBeenCalled()
    expect(screen.getByText(/is muted\. Tap to play\./i)).toBeInTheDocument()
    expect(screen.getByTestId('soundtrack-toggle')).toHaveAttribute('aria-pressed', 'false')
  })

  it('starts playback from an imperative handle', () => {
    const ref = { current: null as SoundtrackPlayerHandle | null }

    render(<SoundtrackPlayer ref={ref} soundtrackId="rain" variant="inline" />)

    expect(play).not.toHaveBeenCalled()
    act(() => {
      ref.current?.startPlayback()
    })
    expect(play).toHaveBeenCalledWith('rain')
    expect(screen.getByText(/is playing\. Tap to mute\./i)).toBeInTheDocument()
  })

  it('does not restart playback after the user mutes', () => {
    const ref = { current: null as SoundtrackPlayerHandle | null }

    render(<SoundtrackPlayer ref={ref} soundtrackId="rain" variant="inline" />)

    act(() => {
      ref.current?.startPlayback()
    })

    fireEvent.click(screen.getByTestId('soundtrack-toggle'))
    expect(stop).toHaveBeenCalled()

    play.mockClear()
    act(() => {
      ref.current?.startPlayback()
    })

    expect(play).not.toHaveBeenCalled()
    expect(screen.getByText(/is muted\. Tap to play\./i)).toBeInTheDocument()
  })

  it('does not call play again when startPlayback runs while already playing', () => {
    const ref = { current: null as SoundtrackPlayerHandle | null }

    render(<SoundtrackPlayer ref={ref} soundtrackId="rain" variant="inline" />)

    act(() => {
      ref.current?.startPlayback()
    })
    expect(play).toHaveBeenCalledTimes(1)

    play.mockClear()
    act(() => {
      ref.current?.startPlayback()
    })

    expect(play).not.toHaveBeenCalled()
  })
})
