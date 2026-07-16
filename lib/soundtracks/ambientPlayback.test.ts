import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { startAmbientSound, stopAmbientSound } from '@/lib/soundtracks/ambientPlayback'

class MockAudio {
  loop = false
  volume = 1
  currentTime = 0
  preload = ''
  src = ''

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
    vi.unstubAllGlobals()
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
    const ids = ['thunderstorm', 'wind', 'piano', 'warm-room', 'cafe'] as const

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
