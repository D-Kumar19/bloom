import Image from 'next/image'

import { DiscoveryPage } from '@/components/discovery/DiscoveryPage'
import { Button } from '@/components/ui/Button'
import { getBouquetById } from '@/lib/bouquets'
import { getCardStyleById } from '@/lib/cards'
import { GUIDES } from '@/lib/guides'
import { THEMES } from '@/lib/themes'
import { publicPageMetadata } from '@/lib/pageMetadata'

export const metadata = publicPageMetadata({
  title: 'Templates',
  description:
    'Editable occasion starters for a birthday, thank-you, or just-because bouquet. Your words, your choices.',
  path: '/templates',
})

export default function TemplatesPage() {
  return (
    <DiscoveryPage
      title="A beginning, not a script"
      introduction="Choose a gentle starting point, then make every detail your own. The note is yours to write, and you can change the flowers or style at any time. Templates open at Message; starting a new bouquet below begins with flowers."
      templates={false}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((guide) => {
          const bouquet = getBouquetById(guide.state.bouquetId)
          return (
            <article key={guide.slug} className="flex flex-col rounded-3xl border border-bloom-rose/15 bg-surface p-5 shadow-sm">
              {bouquet ? (
                <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl">
                  <Image src={bouquet.thumbnailImage} alt={bouquet.name} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" className="object-contain" />
                </div>
              ) : null}
              <h2 className="font-display text-2xl">{guide.subtitle}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-bloom-ink/80">{guide.paragraph}</p>
              <p className="mt-3 text-xs leading-relaxed text-bloom-ink/70">
                {bouquet?.name} · {getCardStyleById(guide.state.cardStyle)?.name} · {THEMES.find(theme => theme.id === guide.state.theme)?.name}
              </p>
              <Button magical href={`/create?starter=${encodeURIComponent(guide.slug)}`} variant="ghost" className="mt-5 w-full rounded-full">
                Start with this idea
              </Button>
            </article>
          )
        })}
      </div>
    </DiscoveryPage>
  )
}
