import { getSoundtrackSrc, type SoundtrackId } from '@/lib/soundtracks'

export type AmbientPlayback = {
  stop: () => void
  playPromise: Promise<void>
}

let activeAudio: HTMLAudioElement | null = null

function stopActiveAudio(): void {
  if (!activeAudio) {
    return
  }

  activeAudio.pause()
  activeAudio.currentTime = 0
  activeAudio = null
}

export function startAmbientSound(
  id: Exclude<SoundtrackId, 'none'>,
  volume = 0.35,
): AmbientPlayback {
  stopActiveAudio()

  const audio = new Audio(getSoundtrackSrc(id))
  audio.loop = true
  audio.volume = Math.min(1, Math.max(0, volume))
  audio.preload = 'auto'

  const playPromise = audio.play().catch(() => {
    // Browsers block autoplay until the user interacts with the page.
  })

  activeAudio = audio

  return {
    playPromise: playPromise.then(() => undefined),
    stop: () => {
      if (activeAudio !== audio) {
        return
      }

      audio.pause()
      audio.currentTime = 0
      activeAudio = null
    },
  }
}

export function stopAmbientSound(): void {
  stopActiveAudio()
}
