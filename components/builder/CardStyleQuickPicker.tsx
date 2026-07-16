'use client'

import {
  NOTE_CARD_STYLES,
} from '@/lib/cards'
import { getNoteSurfaceClass } from '@/lib/cards'

type CardStyleQuickPickerProps = {
  cardStyle: string
  onSelectNoteStyle: (styleId: string) => void
}

export function CardStyleQuickPicker({
  cardStyle,
  onSelectNoteStyle,
}: CardStyleQuickPickerProps) {
  return (
    <div data-testid="card-style-quick-picker" className="space-y-4">
      <p className="text-sm text-bloom-ink/70">
        Pick a note style. Your message stays as you wrote it.
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {NOTE_CARD_STYLES.map((style) => {
          const isActive = cardStyle === style.id
          const surface = getNoteSurfaceClass(style.id)
          const onDark = style.id === 'midnight'

          return (
            <button
              key={style.id}
              type="button"
              data-testid={`quick-card-${style.id}`}
              aria-pressed={isActive}
              onClick={() => onSelectNoteStyle(style.id)}
              className={`rounded-xl border-2 p-2 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                isActive
                  ? 'border-brand-pink/50 ring-2 ring-brand-pink/15'
                  : 'border-bloom-rose/15'
              }`}
            >
              <div className={`overflow-hidden rounded-lg ${surface} px-3 py-4`}>
                <p
                  className={`text-xs font-semibold ${onDark ? 'text-white' : 'text-black'}`}
                >
                  {style.name}
                </p>
                <p
                  className={`mt-1 text-[10px] italic ${onDark ? 'text-white/70' : 'text-black/65'}`}
                >
                  {style.tagline}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
