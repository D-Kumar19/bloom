import Image from 'next/image'

import { DiscoveryPage } from '@/components/discovery/DiscoveryPage'
import { BOUQUETS, BOUQUET_MEANING_NOTE } from '@/lib/bouquets'
import { publicPageMetadata } from '@/lib/pageMetadata'

export const metadata = publicPageMetadata({
  title: 'Flowers',
  description:
    'Explore Bloom bouquets, their colors, textures, and the gestures they can accompany.',
  path: '/flowers',
})

export default function FlowersPage() {
  return (
    <DiscoveryPage
      title="Flowers, with a feeling"
      introduction="From a single quiet gesture to a bright celebration, find the shapes and colors that feel like them. These are digital bouquets: a little beauty to open wherever they are."
    >
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-bloom-ink/70">
        {BOUQUET_MEANING_NOTE}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BOUQUETS.map((bouquet) => (
          <article key={bouquet.id} className="overflow-hidden rounded-3xl border border-bloom-rose/15 bg-surface p-5">
            <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-surface-muted">
              <Image src={bouquet.thumbnailImage} alt={bouquet.tagline} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" className="object-contain" />
            </div>
            <h2 className="font-display text-2xl">{bouquet.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-bloom-ink/80">{bouquet.description}</p>
            <p className="mt-3 text-sm text-bloom-ink/75"><span className="font-semibold">A thought for:</span> {bouquet.perfectFor}</p>
            <details className="mt-4 border-t border-bloom-rose/15 pt-3 text-sm text-bloom-ink/80">
              <summary className="cursor-pointer rounded-lg py-2 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bloom-ink">
                A little more about {bouquet.name}
              </summary>
              <p className="mt-2 leading-relaxed"><span className="font-semibold">A possible gesture:</span> {bouquet.meaning}</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                {bouquet.facts.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
            </details>
          </article>
        ))}
      </div>
    </DiscoveryPage>
  )
}
