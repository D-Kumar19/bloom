'use client'

import { THEMES } from '@/lib/themes'

type ThemePickerProps = {
  selectedId: string
  onSelect: (id: string) => void
}

export function ThemePicker({ selectedId, onSelect }: ThemePickerProps) {
  return (
    <div>
      <h2 className="mb-4 font-display text-xl text-bloom-ink">Choose the mood</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            data-testid={`theme-${theme.id}`}
            onClick={() => onSelect(theme.id)}
            className={`relative overflow-hidden rounded-2xl border-2 p-1 text-left transition ${
              selectedId === theme.id
                ? 'border-brand-pink ring-2 ring-brand-pink/20'
                : 'border-bloom-rose/15 hover:border-bloom-rose/40'
            }`}
          >
            <div className={`h-20 rounded-xl ${theme.className}`} />
            <p className="mt-2 px-1 text-xs font-medium">{theme.name}</p>
            <p className="px-1 pb-2 text-[10px] text-bloom-ink/60 italic">
              {theme.tagline}
            </p>
            {theme.animated ? (
              <span className="absolute top-2 right-2 rounded-full bg-brand-pink px-2 py-0.5 text-[10px] text-white">
                Animated
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  )
}
