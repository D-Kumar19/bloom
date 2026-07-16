import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { PRERELEASE_CONTACT } from '@/lib/site'

export const metadata = {
  title: 'Pre-release | Bloom',
  description: 'Bloom is in pre-release. The core flow works; the rest is still growing.',
}

export default function PreReleasePage() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col justify-center px-4 py-16 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-bloom-ink/45">
        Honest status report
      </p>
      <h1 className="mt-4 font-display text-4xl text-bloom-ink md:text-5xl">
        You&apos;re early. The petals are still drying.
      </h1>
      <p className="mt-6 text-base leading-relaxed text-bloom-ink/70">
        This is a <strong className="font-medium text-bloom-ink">pre-release</strong> of Bloom.
        Most of the wander-y pages (moments, flower tours, language guides, polite legal
        paperwork) are not here yet, or never were, or went out for milk.
      </p>
      <p className="mt-4 text-base leading-relaxed text-bloom-ink/70">
        What <em>does</em>{' '}
        work on purpose: pick flowers, write a note, share a link.
        That&apos;s the product right now. Everything else is decoration we haven&apos;t hung
        up.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-bloom-ink/60">
        Come back soon. We&apos;re shipping the simplest lovely thing first, then adding the
        fancy bits when they stop wobbling.
      </p>
      <p className="mt-8 rounded-2xl border border-bloom-rose/20 bg-surface px-5 py-4 text-sm leading-relaxed text-bloom-ink/75">
        In a hurry and something broke?{' '}
        <a
          href={`mailto:${PRERELEASE_CONTACT}`}
          className="font-medium text-brand-pink hover:underline"
        >
          {PRERELEASE_CONTACT}
        </a>
        <br />
        <span className="text-bloom-ink/55">Dheeraj reads this. Probably before lunch.</span>
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button href="/create">Create a bouquet</Button>
        <Link
          href="/"
          className="text-sm text-bloom-ink/60 underline-offset-4 hover:text-brand-pink hover:underline"
        >
          Back home
        </Link>
      </div>
    </main>
  )
}
