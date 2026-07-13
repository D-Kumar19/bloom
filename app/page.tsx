import Link from 'next/link'

import { BouquetCounter } from '@/components/landing/BouquetCounter'
import { ExampleGallery } from '@/components/landing/ExampleGallery'
import { ShareFeelingButton } from '@/components/landing/ShareFeelingButton'
import { Button } from '@/components/ui/Button'
import { getBouquetCount } from '@/lib/counter'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const bouquetCount = await getBouquetCount()

  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-bloom-rose">
          Bloom
        </p>
        <h1 className="mt-4 font-display text-4xl text-bloom-ink md:text-6xl">
          Send a beautiful digital bouquet
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-bloom-ink/70 md:text-lg">
          Build a digital bouquet with a personal card. Free, instant, no account
          needed.
        </p>
        <BouquetCounter initialCount={bouquetCount} />
        <Button href="/create" className="mt-10 px-10 py-3 text-base">
          Create Your Bouquet
        </Button>
      </section>

      <section className="border-y border-bloom-rose/10 bg-white/50 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl text-bloom-ink">Why flowers?</h2>
          <p className="mt-4 text-base leading-relaxed text-bloom-ink/70 italic">
            Before texts, before calls, before emails... there were flowers. A
            language older than words. Every petal says what your heart already
            knows.
          </p>
        </div>
      </section>

      <section className="px-4 py-16">
        <h2 className="mb-8 text-center font-display text-3xl text-bloom-ink">
          Example bouquets
        </h2>
        <ExampleGallery />
      </section>

      <section className="border-y border-bloom-rose/10 bg-white/50 px-4 py-16">
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {[
            {
              step: '1',
              title: 'Pick flowers',
              text: 'Each bloom carries a meaning. Compose a message in petals.',
            },
            {
              step: '2',
              title: 'Write your note',
              text: 'Add a personal card with words from the heart.',
            },
            {
              step: '3',
              title: 'Share the link',
              text: 'Send a private link. Nothing is stored on a server.',
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-pink text-sm font-bold text-white">
                {item.step}
              </div>
              <h3 className="font-display text-xl text-bloom-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-bloom-ink/70">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="font-display text-3xl text-bloom-ink">
          Ready to brighten someone&apos;s day?
        </h2>
        <div className="mt-8 flex flex-col items-center gap-4">
          <Button href="/create">Start creating</Button>
          <ShareFeelingButton />
        </div>
        <p className="mt-8">
          <Link href="/guides" className="text-sm text-brand-pink hover:underline">
            Browse flower guides
          </Link>
        </p>
      </section>
    </main>
  )
}
