import Link from 'next/link'

import { DEFAULT_BOUQUET_ID } from '@/lib/bouquets'
import { encodeBouquet } from '@/lib/sharing'
import { MOMENTS } from '@/lib/moments'
import { Button } from '@/components/ui/Button'

const PREVIEW_COUNT = 4
const preview = MOMENTS.slice(0, PREVIEW_COUNT)

export function MomentsPreview() {
  return (
    <section className="px-4 py-14 md:py-18">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl text-bloom-ink md:text-4xl">
            A moment for right now
          </h2>
          <p className="mt-3 text-sm text-bloom-ink/65">
            Real situations, not blog posts. Pick one and start.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {preview.map((moment) => {
            const preset = encodeBouquet({
              bouquetId: moment.preset.bouquetId ?? DEFAULT_BOUQUET_ID,
              cardStyle: moment.preset.cardStyle ?? 'classic-cream',
              to: '',
              message: '',
              from: 'A friend',
              theme: moment.preset.theme ?? 'warm',
            })
            return (
              <article
                key={moment.id}
                className="flex flex-col rounded-2xl border border-bloom-rose/15 bg-surface p-5 shadow-sm"
              >
                <p className="flex-1 text-sm leading-relaxed text-bloom-ink/80">
                  {moment.text}
                </p>
                <Button
                  href={`/create?preset=${preset}`}
                  variant="ghost"
                  className="mt-4 w-full rounded-full border-brand-pink/30 text-brand-pink"
                >
                  Start a bouquet
                </Button>
              </article>
            )
          })}
        </div>
        <p className="mt-8 text-center">
          <Link href="/moments" className="text-sm text-brand-pink hover:underline">
            See more moments
          </Link>
        </p>
      </div>
    </section>
  )
}
