'use client'

import { useState } from 'react'

import { BackdropPreview } from '@/components/backdrop/BackdropPreview'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useAmbientSoundtrack } from '@/hooks/useAmbientSoundtrack'
import { SOUNDTRACK_OPTIONS, type SoundtrackId } from '@/lib/soundtracks'
import {
  getThemeDecorationDescription,
  getThemeMotionDescription,
  isThemeAnimated,
  THEMES,
} from '@/lib/themes'
import type { Theme as ThemeType } from '@/lib/types'

type ThemePickerProps = {
  selectedId: string
  soundtrackId?: string
  onSelect: (id: string) => void
  onSoundtrackSelect: (id: string) => void
}

function ThemeDetailModal({
  theme,
  isSelected,
  open,
  onClose,
  onSelect,
}: {
  theme: ThemeType | null
  isSelected: boolean
  open: boolean
  onClose: () => void
  onSelect: (id: string) => void
}) {
  if (!theme) {
    return null
  }

  const handleSelect = () => {
    onSelect(theme.id)
    onClose()
  }

  const motionDescription = getThemeMotionDescription(theme)
  const decorationDescription = getThemeDecorationDescription(theme.id, {
    animated: isThemeAnimated(theme),
  })
  const animated = isThemeAnimated(theme)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={theme.name}
    >
      <BackdropPreview theme={theme} decorationDensity="scene" className="mx-auto mb-4 h-40 w-full max-w-sm rounded-2xl" />
      <p className="text-sm italic leading-relaxed text-bloom-ink/80">{theme.tagline}</p>
      <p className="mt-4 text-sm leading-relaxed text-bloom-ink/70">
        <span className="font-medium text-bloom-ink">Backdrop:</span>{' '}
        {animated ? 'Animated on the reveal.' : 'Still. Light and ambience only.'}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-bloom-ink/70">{theme.description}</p>
      <p className="mt-4 text-sm leading-relaxed text-bloom-ink/70">
        <span className="font-medium text-bloom-ink">Mood:</span> {theme.mood}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-bloom-ink/70">
        <span className="font-medium text-bloom-ink">Perfect for:</span> {theme.perfectFor}
      </p>
      {motionDescription ? (
        <p className="mt-4 text-sm text-bloom-ink/70">
          <span className="font-medium text-bloom-ink">Motion:</span> {motionDescription}
        </p>
      ) : null}
      {decorationDescription ? (
        <p className="mt-4 text-sm text-bloom-ink/70">
          <span className="font-medium text-bloom-ink">Ambience:</span> {decorationDescription}
        </p>
      ) : null}
      {isSelected ? (
        <p className="mt-5 border-t border-bloom-rose/15 pt-4 text-center text-sm text-bloom-ink/70">
          Selected for your bouquet
        </p>
      ) : (
        <Button data-testid="theme-modal-select" className="mt-5 w-full" onClick={handleSelect}>
          Use this backdrop
        </Button>
      )}
    </Modal>
  )
}

export function ThemePicker({
  selectedId,
  soundtrackId = 'none',
  onSelect,
  onSoundtrackSelect,
}: ThemePickerProps) {
  const [detailTheme, setDetailTheme] = useState<ThemeType | null>(null)
  const { play, stop, isPlaying } = useAmbientSoundtrack({ volume: 0.3 })

  const closeDetail = () => setDetailTheme(null)

  const handleSoundtrackClick = (id: SoundtrackId) => {
    onSoundtrackSelect(id)

    if (id === 'none') {
      stop()
      return
    }

    if (isPlaying(id)) {
      stop()
      return
    }

    play(id)
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10">
      <div>
        <h2 className="font-display text-2xl text-bloom-ink md:text-3xl">Choose your backdrop</h2>
        <p className="mt-1 text-sm text-bloom-ink/60">
          The light behind your bouquet when someone opens it. Tap a swatch for details,
          then select the atmosphere that fits your note.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {THEMES.map((theme) => {
          const isActive = selectedId === theme.id
          const animated = isThemeAnimated(theme)

          return (
            <article
              key={theme.id}
              data-testid={`theme-card-${theme.id}`}
              className={`overflow-hidden rounded-2xl border-2 transition ${
                isActive
                  ? 'border-brand-pink ring-2 ring-brand-pink/20'
                  : 'border-bloom-rose/15 hover:border-bloom-rose/40'
              }`}
            >
              <button
                type="button"
                data-testid={`theme-${theme.id}`}
                onClick={() => setDetailTheme(theme)}
                className="group block w-full p-2 text-left"
              >
                <div className="relative isolate overflow-hidden rounded-xl">
                  <BackdropPreview
                    theme={theme}
                    showDecorations
                    className="h-24 sm:h-28"
                  />
                  {animated ? (
                    <span
                      data-testid={`theme-animated-badge-${theme.id}`}
                      className="absolute top-2 left-2 z-20 rounded-full bg-[#fffcf8] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-brand-pink shadow-[0_1px_4px_rgb(42_36_32/0.18)] ring-1 ring-[#2a2420]/10 md:text-xs"
                    >
                      Animated
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 px-1 text-xs font-medium text-bloom-ink">{theme.name}</p>
                <p className="px-1 pb-1 text-[10px] text-bloom-ink/60 italic">{theme.tagline}</p>
              </button>
              <div className="border-t border-bloom-rose/10 px-2 pb-2">
                <button
                  type="button"
                  data-testid={`theme-select-${theme.id}`}
                  onClick={() => onSelect(theme.id)}
                  className={`w-full rounded-lg px-2 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-brand-pink/10 text-brand-pink'
                      : 'text-bloom-ink/70 hover:bg-bloom-rose/8 hover:text-bloom-ink'
                  }`}
                >
                  {isActive ? 'Selected' : 'Select'}
                </button>
              </div>
            </article>
          )
        })}
      </div>

      <div>
        <h3 className="font-display text-xl text-bloom-ink md:text-2xl">Ambient sound</h3>
        <p className="mt-1 text-sm text-bloom-ink/60">
          Optional. Tap to select and hear a short preview. Recipients can play or mute it when they
          open the bouquet.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SOUNDTRACK_OPTIONS.map((option) => {
            const active = soundtrackId === option.id
            const previewing = isPlaying(option.id)

            return (
              <button
                key={option.id}
                type="button"
                data-testid={`soundtrack-${option.id}`}
                onClick={() => handleSoundtrackClick(option.id)}
                className={`rounded-xl border-2 px-3 py-3 text-left transition ${
                  active
                    ? 'border-brand-pink bg-brand-pink/5'
                    : 'border-bloom-rose/15 hover:border-bloom-rose/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-bloom-ink">{option.label}</p>
                  {option.id !== 'none' && previewing ? (
                    <span
                      className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-brand-pink"
                      aria-hidden
                    >
                      Playing
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-[11px] text-bloom-ink/60">{option.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      <ThemeDetailModal
        theme={detailTheme}
        isSelected={detailTheme?.id === selectedId}
        open={detailTheme !== null}
        onClose={closeDetail}
        onSelect={onSelect}
      />
    </div>
  )
}
