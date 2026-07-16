'use client'

import { useEffect, useState } from 'react'

import { BouquetHero } from '@/components/bouquet/BouquetHero'
import { MessageCard } from '@/components/cards/MessageCard'
import { getBouquetRevealTitle } from '@/lib/bouquet/recipientCopy'
import { GUIDES } from '@/lib/guides'

const DEMO_STATE = {
  ...GUIDES[0].state,
  to: 'You',
  from: 'Maya',
  message: 'Thinking of you today.',
}

const BEAT_MS = 2400
const BEAT_COUNT = 4

export function RevealLoop() {
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBeat((current) => (current + 1) % BEAT_COUNT)
    }, BEAT_MS)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="border-y border-bloom-rose/10 bg-surface-muted px-4 py-12 md:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-2xl text-bloom-ink md:text-3xl">
          Watch it unfold
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-bloom-ink/65">
          A bouquet is not a static image. It arrives in beats: unwrap, bloom, read.
        </p>

        <div
          data-testid="reveal-loop"
          className="relative mx-auto mt-8 max-w-md overflow-hidden rounded-3xl border border-bloom-rose/20 bg-background p-6 shadow-lg"
        >
          <div className="relative min-h-[300px]">
            <div
              data-testid="reveal-loop-beat-0"
              className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ${
                beat === 0 ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <div className="h-24 w-24 rounded-full border-2 border-dashed border-bloom-rose/40 bg-surface-muted" />
              <p className="mt-4 text-sm text-bloom-ink/60">{getBouquetRevealTitle(DEMO_STATE.from)}</p>
            </div>

            <div
              data-testid="reveal-loop-beat-1"
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
                beat === 1 ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <div className="flex w-full scale-90 items-center justify-center">
                <BouquetHero bouquetId={DEMO_STATE.bouquetId} theme={DEMO_STATE.theme} />
              </div>
            </div>

            <div
              data-testid="reveal-loop-beat-2"
              className={`absolute inset-x-0 bottom-2 transition-opacity duration-700 ${
                beat === 2 ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <MessageCard
                styleId={DEMO_STATE.cardStyle}
                to={DEMO_STATE.to}
                message=""
                from=""
                folded
              />
            </div>

            <div
              data-testid="reveal-loop-beat-3"
              className={`absolute inset-x-0 bottom-2 transition-opacity duration-700 ${
                beat === 3 ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <MessageCard
                styleId={DEMO_STATE.cardStyle}
                to={DEMO_STATE.to}
                message={DEMO_STATE.message}
                from={DEMO_STATE.from}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
            {Array.from({ length: BEAT_COUNT }).map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  beat === index ? 'w-5 bg-brand-pink' : 'w-1.5 bg-bloom-rose/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
