'use client'

import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'

import { useAmbientSoundtrack } from '@/hooks/useAmbientSoundtrack'
import { RoundIconButton } from '@/components/ui/RoundIconButton'
import { VolumeOffIcon, VolumeOnIcon } from '@/components/ui/SoundIcons'
import { isSoundtrackId, SOUNDTRACK_OPTIONS } from '@/lib/soundtracks'

export type SoundtrackPlayerHandle = {
  startPlayback: () => void
}

type SoundtrackPlayerProps = {
  soundtrackId?: string
  autoPlay?: boolean
  variant?: 'fixed' | 'inline'
  className?: string
}

function getSoundtrackLabel(id: string): string {
  return SOUNDTRACK_OPTIONS.find((option) => option.id === id)?.label ?? 'Ambient sound'
}

export const SoundtrackPlayer = forwardRef<SoundtrackPlayerHandle, SoundtrackPlayerProps>(
  function SoundtrackPlayer(
    {
      soundtrackId,
      autoPlay = false,
      variant = 'fixed',
      className = '',
    },
    ref,
  ) {
  const [muted, setMuted] = useState(!autoPlay)
  const id = soundtrackId && isSoundtrackId(soundtrackId) ? soundtrackId : 'none'
  const hasSoundtrack = id !== 'none'
  const { play, stop, isPlaying } = useAmbientSoundtrack({ volume: 0.35 })
  const label = getSoundtrackLabel(id)

  const startPlayback = useCallback(() => {
    if (!hasSoundtrack) {
      return
    }

    setMuted(false)
    play(id)
  }, [hasSoundtrack, id, play])

  useImperativeHandle(ref, () => ({ startPlayback }), [startPlayback])

  useEffect(() => {
    if (!hasSoundtrack || muted) {
      return
    }

    play(id)
    return () => stop()
  }, [hasSoundtrack, muted, id, play, stop])

  if (!hasSoundtrack) {
    return null
  }

  const playing = isPlaying(id) && !muted

  const handleToggle = () => {
    if (playing) {
      stop()
      setMuted(true)
      return
    }

    setMuted(false)
  }

  const toggleButton = (
    <RoundIconButton
      data-testid="soundtrack-toggle"
      onClick={handleToggle}
      aria-label={playing ? `Mute ${label}` : `Play ${label}`}
      aria-pressed={playing}
    >
      {playing ? <VolumeOnIcon /> : <VolumeOffIcon />}
    </RoundIconButton>
  )

  if (variant === 'inline') {
    return (
      <div
        data-testid="soundtrack-inline"
        className="flex w-full items-center justify-between gap-4 rounded-2xl border border-bloom-rose/20 bg-surface-muted px-4 py-3"
      >
        <div className="min-w-0">
          <p className="text-sm font-medium text-bloom-ink">Ambient sound</p>
          <p className="text-xs text-bloom-ink/60">
            {playing ? (
              <>
                <span className="font-medium text-brand-pink">{label}</span> is playing. Tap to
                mute.
              </>
            ) : (
              <>
                <span className="font-medium text-bloom-ink/80">{label}</span> is muted. Tap to
                play.
              </>
            )}
          </p>
        </div>
        {toggleButton}
      </div>
    )
  }

  return (
    <div
      data-testid="soundtrack-fixed"
      className={className || 'fixed bottom-6 right-6 z-30'}
    >
      {toggleButton}
    </div>
  )
  },
)
