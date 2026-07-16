import Link from 'next/link'

import { FEELING_TILE_INK, FEELING_TILE_INK_MUTED, MOODS } from '@/lib/moods'

export function FeelingTiles() {
  return (
    <section id="feelings" className="scroll-mt-28 px-4 py-14 md:py-18">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl text-bloom-ink md:text-4xl">
            Explore by feeling
          </h2>
          <p className="mt-3 text-sm text-bloom-ink/65">
            Start with a mood. Bloom fills in the rest. You make it yours.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
          {MOODS.map((mood) => (
            <Link
              key={mood.id}
              href={`/create?mood=${mood.id}`}
              data-testid={`feeling-tile-${mood.id}`}
              className={`rounded-2xl border-2 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${mood.tintClass} ${FEELING_TILE_INK}`}
            >
              <span className="text-2xl" aria-hidden>
                {mood.emoji}
              </span>
              <p className={`mt-2 font-display text-lg ${FEELING_TILE_INK}`}>{mood.label}</p>
              <p className={`mt-1 text-xs leading-relaxed ${FEELING_TILE_INK_MUTED}`}>
                {mood.handoff}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
