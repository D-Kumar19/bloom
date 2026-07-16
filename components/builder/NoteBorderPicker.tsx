'use client'

import {
  DEFAULT_NOTE_BORDER,
  NOTE_BORDER_COLOR_OPTIONS,
  NOTE_BORDER_STYLE_OPTIONS,
} from '@/lib/cards'
import type { NoteBorder, NoteBorderStyle } from '@/lib/types'

type NoteBorderPickerProps = {
  noteBorder: NoteBorder
  onNoteBorderChange: (border: NoteBorder) => void
}

export function NoteBorderPicker({ noteBorder, onNoteBorderChange }: NoteBorderPickerProps) {
  const border = noteBorder ?? DEFAULT_NOTE_BORDER

  const setStyle = (style: NoteBorderStyle) => {
    onNoteBorderChange({ ...border, style })
  }

  const setColor = (color: string) => {
    onNoteBorderChange({ ...border, color })
  }

  return (
    <div
      data-testid="note-border-picker"
      className="pt-3"
    >
      <p className="text-sm font-semibold text-bloom-ink">Note border</p>
      <p className="mt-0.5 text-xs text-bloom-ink/55">Frame your note with a style and color.</p>

      <div className="mt-3 space-y-3">
        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-bloom-ink/45">
            Style
          </p>
          <div className="flex flex-wrap gap-1.5">
            {NOTE_BORDER_STYLE_OPTIONS.map((option) => {
              const active = border.style === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  data-testid={`note-border-style-${option.id}`}
                  aria-pressed={active}
                  onClick={() => setStyle(option.id)}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                    active
                      ? 'border-brand-pink bg-brand-pink/10 text-brand-pink'
                      : 'border-bloom-rose/20 bg-surface text-bloom-ink hover:border-brand-pink/40'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-bloom-ink/45">
            Color
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {NOTE_BORDER_COLOR_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                data-testid={`note-border-color-${option.id}`}
                title={`Border color: ${option.label}`}
                aria-label={`Border color ${option.label}`}
                onClick={() => setColor(option.value)}
                className={`h-7 w-7 rounded-full border-2 transition ${
                  border.color === option.value
                    ? 'border-brand-pink ring-2 ring-brand-pink/20'
                    : option.id === 'white'
                      ? 'border-bloom-rose/25'
                      : 'border-white'
                }`}
                style={{ backgroundColor: option.value }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
