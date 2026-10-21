import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { startAmbientSound, stopAmbientSound } from '@/lib/soundtracks/ambientPlayback'

class MockAudio {
  loop = false
  volume = 1
  currentTime = 0
  preload = ''
  src = ''
  onerror: (() => void) | null = null

  play = vi.fn().mockResolvedValue(undefined)
  pause = vi.fn()

  constructor(src?: string) {
    this.src = src ?? ''
  }
}

describe('ambientPlayback', () => {
  let AudioMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    AudioMock = vi.fn(function Audio(_src?: string) {
      return new MockAudio(_src)
    })
    vi.stubGlobal('Audio', AudioMock)
  })

  afterEach(() => {
    stopAmbientSound()
    vi.unstubAllGlobals()
  })

  it('rejects playback failure rather than reporting success', async () => {
    const audio = new MockAudio()
    audio.play.mockRejectedValueOnce(new Error('autoplay blocked'))
    AudioMock.mockImplementationOnce(function Audio() { return audio })
    const playback = startAmbientSound('rain')
    await expect(playback.playPromise).rejects.toThrow('autoplay blocked')
    expect(audio.pause).toHaveBeenCalled()
    const retry = startAmbientSound('rain')
    await expect(retry.playPromise).resolves.toBeUndefined()
    expect(AudioMock).toHaveBeenCalledTimes(2)
  })

  it('reports media errors after playback has started and allows a fresh instance', async () => {
    const onError = vi.fn()
    const playback = startAmbientSound('rain', 0.2, onError)
    await playback.playPromise
    const audio = AudioMock.mock.results[0].value as MockAudio
    audio.onerror?.()
    expect(onError).toHaveBeenCalledOnce()
    expect(audio.pause).toHaveBeenCalled()
    await startAmbientSound('rain').playPromise
    expect(AudioMock).toHaveBeenCalledTimes(2)
  })

  it('does not report success for a duplicate request while playback is still failing', async () => {
    const audio = new MockAudio()
    audio.play.mockRejectedValueOnce(new Error('media unavailable'))
    AudioMock.mockImplementationOnce(function Audio() { return audio })
    const first = startAmbientSound('rain')
    const second = startAmbientSound('rain')
    const results = await Promise.allSettled([first.playPromise, second.playPromise])
    expect(results.map(result => result.status)).toEqual(['rejected', 'rejected'])
    expect(AudioMock).toHaveBeenCalledOnce()
  })

  it('starts looping audio for a soundtrack', () => {
    const playback = startAmbientSound('rain', 0.2)
    const audio = AudioMock.mock.results[0]?.value as MockAudio

    expect(audio.src).toContain('/sounds/rain.mp3')
    expect(audio.loop).toBe(true)
    expect(audio.volume).toBe(0.2)
    expect(audio.play).toHaveBeenCalled()

    playback.stop()
    expect(audio.pause).toHaveBeenCalled()
    expect(audio.currentTime).toBe(0)
  })

  it('starts and stops each soundtrack file', () => {
    const ids = ['thunderstorm', 'wind', 'piano', 'instrumental', 'warm-room', 'cafe'] as const

    ids.forEach((id) => {
      const playback = startAmbientSound(id, 0.15)
      playback.stop()
    })

    expect(AudioMock).toHaveBeenCalledTimes(ids.length)
  })

  it('stopAmbientSound pauses the active track', () => {
    startAmbientSound('rain', 0.2)
    const audio = AudioMock.mock.results[0]?.value as MockAudio

    stopAmbientSound()

    expect(audio.pause).toHaveBeenCalled()
    expect(audio.currentTime).toBe(0)
  })

  it('does not restart audio when the same soundtrack is already playing', () => {
    const playback = startAmbientSound('rain', 0.2)
    const firstAudio = AudioMock.mock.results[0]?.value as MockAudio

    const again = startAmbientSound('rain', 0.2)

    expect(AudioMock).toHaveBeenCalledTimes(1)
    expect(firstAudio.play).toHaveBeenCalledTimes(1)
    expect(again).toBeDefined()

    playback.stop()
  })
})
