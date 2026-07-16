import Link from 'next/link'

import { encodeBouquet } from '@/lib/sharing'
import { GUIDES } from '@/lib/guides'

const EXAMPLES = [
  {
    title: 'A birthday surprise',
    note: 'Happy birthday to the person who makes every room brighter.',
    slug: 'birthday' as const,
  },
  {
    title: 'Just because',
    note: 'No reason. Just thinking of you today.',
    slug: 'just-because' as const,
  },
  {
    title: 'Long distance love',
    note: 'Miles apart, but you are always right here with me.',
    slug: 'love-letter' as const,
  },
]

export function ExampleGallery() {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
      {EXAMPLES.map((example) => {
        const guide = GUIDES.find((g) => g.slug === example.slug)!
        const state = {
          ...guide.state,
          to: 'You',
          from: 'Someone who cares',
          message: example.note,
        }
        const hash = encodeBouquet(state)
        return (
          <Link
            key={example.title}
            href={`/bouquet?b=${hash}`}
            className="rounded-3xl border border-bloom-rose/20 bg-surface p-5 text-left shadow-sm transition hover:border-brand-pink/40 hover:shadow-md"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-bloom-rose">
              Example bouquet
            </p>
            <h3 className="mt-2 font-display text-xl text-bloom-ink">
              {example.title}
            </h3>
            <p className="mt-2 text-sm italic text-bloom-ink/70">
              &ldquo;{example.note}&rdquo;
            </p>
            <p className="mt-4 text-xs font-medium text-brand-pink">
              View this bouquet
            </p>
          </Link>
        )
      })}
    </div>
  )
}
