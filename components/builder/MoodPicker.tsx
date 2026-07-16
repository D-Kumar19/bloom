'use client'

import {
  FEELING_TILE_INK,
  FEELING_TILE_INK_MUTED,
  MOODS,
  type MoodId,
} from '@/lib/moods'

type MoodPickerProps = {
  selectedId?: MoodId
  onSelect: (moodId: MoodId) => void
}

export function MoodPicker({ selectedId, onSelect }: MoodPickerProps) {
  return (
    <div>
      <h2 className="mb-2 font-display text-2xl text-bloom-ink md:text-3xl">
        What are you feeling?
      </h2>
      <p className="mb-6 text-sm text-bloom-ink/65">
        Pick a mood and we will suggest a bouquet and a card. You can change
        everything after.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {MOODS.map((mood) => {
          const selected = selectedId === mood.id
          return (
            <button
              key={mood.id}
              type="button"
              data-testid={`mood-${mood.id}`}
              onClick={() => onSelect(mood.id)}
              className={`rounded-2xl border-2 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                selected
                  ? 'border-brand-pink ring-2 ring-brand-pink/20'
                  : 'border-bloom-rose/15'
              } ${mood.tintClass} ${FEELING_TILE_INK}`}
            >
              <span className="text-2xl" aria-hidden>
                {mood.emoji}
              </span>
              <p className={`mt-2 font-display text-lg ${FEELING_TILE_INK}`}>{mood.label}</p>
              <p className={`mt-1 text-xs leading-relaxed ${FEELING_TILE_INK_MUTED}`}>
                {mood.handoff}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
