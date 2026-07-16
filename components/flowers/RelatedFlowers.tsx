import Image from 'next/image'
import Link from 'next/link'

import { getFlowerById } from '@/lib/flowers'

type RelatedFlowersProps = {
  relatedIds: string[]
  currentId: string
}

export function RelatedFlowers({ relatedIds, currentId }: RelatedFlowersProps) {
  const related = relatedIds
    .filter((id) => id !== currentId)
    .map((id) => getFlowerById(id))
    .filter((flower): flower is NonNullable<typeof flower> => Boolean(flower))
    .slice(0, 4)

  if (related.length === 0) {
    return null
  }

  return (
    <section>
      <h2 className="font-display text-xl text-bloom-ink">Related blooms</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {related.map((flower) => (
          <Link
            key={flower.id}
            href={`/flowers/${flower.id}`}
            className="flex flex-col items-center rounded-2xl border border-bloom-rose/15 bg-surface p-3 text-center transition hover:-translate-y-0.5 hover:border-brand-pink/30 hover:shadow-sm"
          >
            <div className="relative h-16 w-16">
              <Image
                src={flower.image}
                alt={flower.name}
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
            <span className="mt-2 text-sm font-medium text-bloom-ink">{flower.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
