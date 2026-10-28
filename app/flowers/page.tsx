import Image from 'next/image'

import { DiscoveryPage } from '@/components/discovery/DiscoveryPage'
import { BOUQUETS } from '@/lib/bouquets'

export const metadata = {
  title: 'Flowers',
  description: 'Explore Bloom bouquets, their colors, textures, and the gestures they can accompany.',
}

export default function FlowersPage() {
  return (
    <DiscoveryPage
      title="Flowers, with a feeling"
      introduction="From a single quiet gesture to a bright celebration, find the shapes and colors that feel like them. These are digital bouquets: a little beauty to open wherever they are."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BOUQUETS.map((bouquet) => (
          <article key={bouquet.id} className="overflow-hidden rounded-3xl border border-bloom-rose/15 bg-surface p-5">
            <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-surface-muted">
              <Image src={bouquet.thumbnailImage} alt={bouquet.tagline} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" className="object-contain" />
            </div>
            <h2 className="font-display text-2xl">{bouquet.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-bloom-ink/80">{bouquet.description}</p>
            <p className="mt-3 text-sm text-bloom-ink/75"><span className="font-semibold">A thought for:</span> {bouquet.perfectFor}</p>
          </article>
        ))}
      </div>
      <p className="mt-6 max-w-2xl text-sm text-bloom-ink/70">
        There is no universal flower rulebook. Personal taste and cultural associations matter
        more than a prescribed meaning; choose what feels right for your recipient.
      </p>
    </DiscoveryPage>
  )
}
