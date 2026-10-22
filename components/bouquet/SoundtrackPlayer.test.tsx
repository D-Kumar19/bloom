import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SoundtrackPlayer, type SoundtrackPlayerHandle } from '@/components/bouquet/SoundtrackPlayer'

const play = vi.fn()
const stop = vi.fn()
const audioState = vi.hoisted(() => ({ error: null as string | null }))

vi.mock('@/hooks/useAmbientSoundtrack', () => ({
  useAmbientSoundtrack: () => ({
    play,
    stop,
    error: audioState.error,
    isPlaying: (id: string) => id === 'rain',
  }),
}))

describe('SoundtrackPlayer', () => {
  beforeEach(() => {
    play.mockClear()
    stop.mockClear()
    audioState.error = null
  })

  it('renders nothing when soundtrack is none', () => {
    const { container } = render(<SoundtrackPlayer soundtrackId="none" autoPlay />)
    expect(container).toBeEmptyDOMElement()
  })

  it('stops the previous track when the soundtrack changes to silence', () => {
    const { rerender } = render(<SoundtrackPlayer soundtrackId="rain" autoPlay />)
    stop.mockClear()
    rerender(<SoundtrackPlayer soundtrackId="none" autoPlay />)
    expect(stop).toHaveBeenCalledOnce()
  })

  it.each(['inline', 'fixed'] as const)('shows a single retry message in the %s player', variant => {
    audioState.error = 'Sound could not play. Tap to retry, or choose silence.'
    render(<SoundtrackPlayer soundtrackId="rain" variant={variant} />)
    expect(screen.getAllByRole('status')).toHaveLength(1)
    expect(screen.getByRole('status')).toHaveTextContent(audioState.error)
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
