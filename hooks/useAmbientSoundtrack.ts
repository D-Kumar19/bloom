'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { startAmbientSound, stopAmbientSound } from '@/lib/soundtracks/ambientPlayback'
import { isSoundtrackId, type SoundtrackId } from '@/lib/soundtracks'

type UseAmbientSoundtrackOptions = {
  volume?: number
}

export function useAmbientSoundtrack(options: UseAmbientSoundtrackOptions = {}) {
  const { volume = 0.35 } = options
  const playbackRef = useRef<ReturnType<typeof startAmbientSound> | null>(null)
  const playingIdRef = useRef<SoundtrackId | null>(null)
  const [playingId, setPlayingId] = useState<SoundtrackId | null>(null)

  const stop = useCallback(() => {
    playbackRef.current?.stop()
    playbackRef.current = null
    stopAmbientSound()
    playingIdRef.current = null
    setPlayingId(null)
  }, [])

  const play = useCallback(
    (id: SoundtrackId) => {
      if (!isSoundtrackId(id) || id === 'none') {
        stop()
        return
      }

      if (playingIdRef.current === id && playbackRef.current) {
        return
      }

      playbackRef.current?.stop()
      const playback = startAmbientSound(id, volume)
      playbackRef.current = playback
      playingIdRef.current = id

      void playback.playPromise.then(() => {
        if (playbackRef.current === playback) {
          setPlayingId(id)
        }
      })
    },
    [stop, volume],
  )

  useEffect(() => () => stop(), [stop])

  return {
    playingId,
    play,
    stop,
    isPlaying: (id: SoundtrackId) => playingId === id,
  }
}
