import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAmbientSoundtrack } from '@/hooks/useAmbientSoundtrack'
import { startAmbientSound } from '@/lib/soundtracks/ambientPlayback'

vi.mock('@/lib/soundtracks/ambientPlayback', () => ({ startAmbientSound: vi.fn() }))
const start = vi.mocked(startAmbientSound)

describe('ambient playback state', () => {
  afterEach(() => vi.restoreAllMocks())
  it('reports failure, never marks playing, and permits retry', async () => {
    const logger = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const stop = vi.fn()
    start.mockReturnValueOnce({ stop, playPromise: Promise.reject(new Error('blocked')) })
      .mockReturnValueOnce({ stop, playPromise: Promise.resolve() })
    const { result } = renderHook(useAmbientSoundtrack)
    act(() => result.current.play('rain'))
    await waitFor(() => expect(result.current.error).toContain('retry'))
    expect(result.current.isPlaying('rain')).toBe(false)
    act(() => result.current.play('rain'))
    await waitFor(() => expect(result.current.isPlaying('rain')).toBe(true))
    expect(result.current.error).toBeNull()
    expect(logger).toHaveBeenCalled()
  })
  it('ignores stale promises after switching or stopping', async () => {
    let resolve!: () => void
    const stop = vi.fn()
    start.mockReturnValueOnce({ stop, playPromise: new Promise<void>(r => { resolve = r }) })
      .mockReturnValueOnce({ stop, playPromise: Promise.resolve() })
    const { result } = renderHook(useAmbientSoundtrack)
    act(() => result.current.play('rain'))
    act(() => result.current.play('piano'))
    await waitFor(() => expect(result.current.isPlaying('piano')).toBe(true))
    await act(async () => resolve())
    expect(result.current.isPlaying('rain')).toBe(false)
    act(() => result.current.stop())
    expect(result.current.playingId).toBeNull()
  })
  it('handles a media error after playback begins and cleans up on unmount', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const stop = vi.fn()
    start.mockReturnValue({ stop, playPromise: Promise.resolve() })
    const { result, unmount } = renderHook(useAmbientSoundtrack)
    act(() => result.current.play('rain'))
    await waitFor(() => expect(result.current.isPlaying('rain')).toBe(true))
    act(() => start.mock.calls.at(-1)?.[2]?.())
    expect(result.current.playingId).toBeNull()
    expect(result.current.error).toContain('retry')
    unmount()
    expect(stop).toHaveBeenCalled()
  })
})
