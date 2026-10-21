import { getSoundtrackSrc, type SoundtrackId } from '@/lib/soundtracks'

export type AmbientPlayback = {
  stop: () => void
  playPromise: Promise<void>
}

let activeAudio: HTMLAudioElement | null = null
let activeSoundtrackId: Exclude<SoundtrackId, 'none'> | null = null
let activePlayPromise: Promise<void> | null = null

function stopActiveAudio(): void {
  if (!activeAudio) {
    return
  }

  activeAudio.pause()
  activeAudio.currentTime = 0
  activeAudio = null
  activeSoundtrackId = null
  activePlayPromise = null
}

export function startAmbientSound(
  id: Exclude<SoundtrackId, 'none'>,
  volume = 0.35,
  onError?: () => void,
): AmbientPlayback {
  if (activeAudio && activeSoundtrackId === id && !activeAudio.paused) {
    const audio = activeAudio
    return {
      playPromise: activePlayPromise ?? Promise.resolve(),
      stop: () => {
        if (activeAudio !== audio) {
          return
        }

        audio.pause()
        audio.currentTime = 0
        activeAudio = null
        activeSoundtrackId = null
        activePlayPromise = null
      },
    }
  }

  stopActiveAudio()

  const audio = new Audio(getSoundtrackSrc(id))
  audio.loop = true
  audio.volume = Math.min(1, Math.max(0, volume))
  audio.preload = 'auto'

  activeAudio = audio
  activeSoundtrackId = id
  audio.onerror = () => {
    if (activeAudio !== audio) return
    stopActiveAudio()
    onError?.()
  }
  const playPromise = audio.play().catch((error: unknown) => {
    if (activeAudio === audio) stopActiveAudio()
    throw error
  })
  activePlayPromise = playPromise

  return {
    playPromise: playPromise.then(() => undefined),
    stop: () => {
      if (activeAudio !== audio) {
        return
      }

      audio.pause()
      audio.currentTime = 0
      activeAudio = null
      activeSoundtrackId = null
      activePlayPromise = null
    },
  }
}

export function stopAmbientSound(): void {
  stopActiveAudio()
}
