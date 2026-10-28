'use client'

import { Button } from '@/components/ui/Button'
import { useAmbientSoundtrack } from '@/hooks/useAmbientSoundtrack'
import { SOUNDTRACK_OPTIONS } from '@/lib/soundtracks'

export function SoundPreviews() {
  const { play, stop, isPlaying, error } = useAmbientSoundtrack({ volume: 0.3 })

  return (
    <div>
      {error ? <p role="alert" className="mb-5 rounded-2xl border border-bloom-rose/30 p-4 text-sm">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {SOUNDTRACK_OPTIONS.map((sound) => (
          <article key={sound.id} className="rounded-3xl border border-bloom-rose/15 bg-surface p-6">
            <h2 className="font-display text-2xl">{sound.label}</h2>
            <p className="mt-2 text-sm text-bloom-ink/75">{sound.description}</p>
            <Button
              magical
              variant="ghost"
              className="mt-4 rounded-full"
              onClick={() => sound.id === 'none' || isPlaying(sound.id) ? stop() : play(sound.id)}
            >
              {sound.id === 'none' ? 'Stop sound' : `${isPlaying(sound.id) ? 'Stop' : 'Listen to'} ${sound.label}`}
            </Button>
            {isPlaying(sound.id) ? <p role="status" className="mt-2 text-sm">Playing {sound.label}</p> : null}
          </article>
        ))}
      </div>
    </div>
  )
}
