import Image from 'next/image'

import { Button } from '@/components/ui/Button'
import type { Flower } from '@/lib/types'

type FlowerCatalogCardProps = {
  flower: Flower
}

export function FlowerCatalogCard({ flower }: FlowerCatalogCardProps) {
  return (
    <article
      data-testid={`flower-card-${flower.id}`}
      id={flower.id}
      className="flex scroll-mt-28 flex-col rounded-2xl border border-bloom-rose/15 bg-surface p-4 text-center shadow-sm"
    >
      <div className="relative mx-auto aspect-square w-full max-w-[100px]">
        <Image
          src={flower.image}
          alt={flower.name}
          fill
          sizes="100px"
          className="object-contain"
        />
      </div>
      <h3 className="mt-3 font-display text-base text-bloom-ink">{flower.name}</h3>
      <p className="mt-1 flex-1 text-xs leading-relaxed text-bloom-ink/60 line-clamp-2">
        {flower.meaning}
      </p>
      <Button
        href={`/flowers/${flower.id}`}
        variant="ghost"
        className="mt-3 w-full rounded-full border-brand-pink/30 px-4 py-2 text-xs text-brand-pink"
      >
        Read more
      </Button>
    </article>
  )
}
