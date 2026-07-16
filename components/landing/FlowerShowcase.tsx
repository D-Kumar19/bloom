import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { FLOWERS } from '@/lib/flowers'

const SHOWCASE_FLOWERS = FLOWERS.slice(0, 8)

export function FlowerShowcase() {
  return (
    <section id="flowers" className="scroll-mt-28 border-y border-bloom-rose/10 bg-surface-muted px-4 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl text-bloom-ink md:text-4xl">
            Every flower has something to say
          </h2>
          <p className="mt-4 text-base leading-relaxed text-bloom-ink/70">
            Bloom is built on the old language of flowers. Each bloom carries a meaning you
            can mix into a bouquet, like choosing the right words for a letter.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {SHOWCASE_FLOWERS.map((flower) => (
            <article
              key={flower.id}
              className="rounded-2xl border border-bloom-rose/15 bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative mx-auto aspect-square w-full max-w-[120px]">
                <Image
                  src={flower.image}
                  alt={flower.name}
                  fill
                  sizes="120px"
                  className="object-contain"
                />
              </div>
              <h3 className="mt-3 text-center font-display text-lg text-bloom-ink">
                {flower.name}
              </h3>
              <p className="mt-1 text-center text-xs leading-relaxed text-bloom-ink/65 line-clamp-2">
                {flower.meaning}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <Button href="/create">Start your bouquet</Button>
          <Link href="/guides" className="text-sm text-brand-pink hover:underline">
            Read the flower guides
          </Link>
        </div>
      </div>
    </section>
  )
}
