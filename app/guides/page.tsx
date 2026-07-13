import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { GUIDES } from '@/lib/guides'

export default function GuidesIndexPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display text-4xl text-bloom-ink">Flower guides</h1>
      <p className="mt-4 text-bloom-ink/70">
        Not sure what to send? Start with a guide and make it yours.
      </p>
      <div className="mt-10 space-y-4">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="block rounded-3xl border border-bloom-rose/20 bg-white p-5 hover:border-brand-pink/40"
          >
            <h2 className="font-display text-xl text-bloom-ink">{guide.title}</h2>
            <p className="mt-1 text-sm text-bloom-rose">{guide.subtitle}</p>
          </Link>
        ))}
      </div>
      <Button href="/create" className="mt-10">
        Start from scratch
      </Button>
    </main>
  )
}
