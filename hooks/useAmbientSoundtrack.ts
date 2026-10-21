'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { startAmbientSound } from '@/lib/soundtracks/ambientPlayback'
import { isSoundtrackId, type SoundtrackId } from '@/lib/soundtracks'

type UseAmbientSoundtrackOptions = {
  volume?: number
}

export function useAmbientSoundtrack(options: UseAmbientSoundtrackOptions = {}) {
  const { volume = 0.35 } = options
  const playbackRef = useRef<ReturnType<typeof startAmbientSound> | null>(null)
  const playingIdRef = useRef<SoundtrackId | null>(null)
  const [playingId, setPlayingId] = useState<SoundtrackId | null>(null)
  const [error, setError] = useState<string | null>(null)

  const stop = useCallback(() => {
    playbackRef.current?.stop()
    playbackRef.current = null
    playingIdRef.current = null
    setPlayingId(null)
    setError(null)
  }, [])

  const play = useCallback(
    (id: SoundtrackId) => {
      if (!isSoundtrackId(id)) {
        console.error('Unknown Bloom soundtrack requested.')
        stop()
        setError('This soundtrack is unavailable. Choose another sound.')
        return
      }
      if (id === 'none') {
        stop()
        return
      }

      if (playingIdRef.current === id && playbackRef.current) {
        return
      }

      playbackRef.current?.stop()
      setPlayingId(null)
      setError(null)
      let playback: ReturnType<typeof startAmbientSound>
      const fail = () => {
        if (playbackRef.current !== playback) return
        playback.stop()
        playbackRef.current = null
        playingIdRef.current = null
        setPlayingId(null)
        console.warn('Bloom ambient playback failed. The user can retry.')
        setError('Sound could not play. Tap to retry, or choose silence.')
      }
      try {
        playback = startAmbientSound(id, volume, fail)
      } catch {
        playbackRef.current = null
        playingIdRef.current = null
        console.warn('Bloom ambient playback could not start.')
        setError('Sound could not play. Tap to retry, or choose silence.')
        return
      }
      playbackRef.current = playback
      playingIdRef.current = id

      void playback.playPromise.then(() => {
        if (playbackRef.current === playback) {
          setPlayingId(id)
        }
      }, fail)
    },
    [stop, volume],
  )

  useEffect(() => () => stop(), [stop])

  return {
    playingId,
    error,
    play,
    stop,
    isPlaying: (id: SoundtrackId) => playingId === id,
  }
}
