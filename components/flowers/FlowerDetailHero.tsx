import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { FLOWERS } from '@/lib/flowers'
import type { Flower } from '@/lib/types'

type FlowerDetailHeroProps = {
  flower: Flower
}

export function FlowerDetailHero({ flower }: FlowerDetailHeroProps) {
  return (
    <header className="mx-auto max-w-2xl text-center">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-bloom-ink/50">
        <ol className="flex flex-wrap items-center justify-center gap-1">
          <li>
            <Link href="/" className="hover:text-brand-pink">
              Home
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li>
            <Link href="/flowers" className="hover:text-brand-pink">
              Flowers
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li className="text-bloom-ink/70">{flower.name}</li>
        </ol>
      </nav>

      <div className="relative mx-auto mb-6 aspect-square w-40 sm:w-48">
        <Image
          src={flower.image}
          alt={flower.name}
          fill
          sizes="192px"
          className="object-contain"
          priority
        />
      </div>

      <h1 className="font-display text-4xl text-bloom-ink md:text-5xl">{flower.name}</h1>
      <p className="mt-4 text-base italic leading-relaxed text-bloom-ink/80 md:text-lg">
        {flower.meaning}
      </p>
    </header>
  )
}
