import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { GUIDES } from '@/lib/guides'

export const metadata = {
  title: 'Explore',
  description: 'A little guide to choosing flowers, stationery, backdrops, and optional sound for your Bloom bouquet.',
}

const sections = [
  {
    id: 'flowers',
    title: 'Flowers',
    description: 'A single stem or a whole happy crowd. Choose a bouquet that feels like them, not just the occasion. The builder is where you can browse and pick your flowers.',
  },
  {
    id: 'note-styles',
    title: 'Note styles',
    description: 'The stationery sets the mood; your words do the important part. Choose a card, add a border, and format your note in the builder. No poetry qualification required.',
  },
  {
    id: 'backdrops',
    title: 'Backdrops',
    description: 'A little morning light, a softer glow, or something after dark. Try the backdrops in the atmosphere step and choose the setting that suits your gesture.',
  },
  {
    id: 'ambient-sound',
    title: 'Ambient sound',
    description: "Rain, piano, or a little instrumental company. Sound is optional, and silence is a perfectly good choice. Choose a track in the atmosphere step; playback may need a tap in the recipient's browser.",
  },
  {
    id: 'templates',
    title: 'Templates',
    description: 'Choose a gentle starting point, then make every detail your own. The note is yours to write, and you can change the flowers or style at any time.',
  },
]

export default function ExplorePage() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-6 py-16 text-bloom-ink">
      <header className="space-y-4">
        <h1 className="font-display text-4xl">A little wander before the flowers</h1>
        <p>
          Here is what goes into a Bloom bouquet. This is a quick guide;
          the choosing, trying, and making happen in the builder.
        </p>
      </header>
      {sections.map(({ id, title, description }) => (
        <section key={id} id={id} className="scroll-mt-8 space-y-3">
          <h2 className="font-display text-2xl">{title}</h2>
          <p className="leading-relaxed">{description}</p>
          {id === 'templates' ? (
            <div className="grid gap-4 pt-2 sm:grid-cols-2">
              {GUIDES.map((guide) => (
                <article
                  key={guide.slug}
                  className="flex flex-col rounded-3xl border border-bloom-rose/15 bg-surface p-5 shadow-sm"
                >
                  <h3 className="font-display text-xl">{guide.subtitle}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-bloom-ink/75">
                    {guide.paragraph}
                  </p>
                  <Button
                    href={`/create?starter=${encodeURIComponent(guide.slug)}`}
                    variant="ghost"
                    className="mt-4 w-full rounded-full border-brand-pink/30 text-brand-pink"
                  >
                    Start with this idea
                  </Button>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      ))}
      <div className="space-y-4 border-t border-bloom-rose/20 pt-6">
        <Button href="/create">Create your bouquet</Button>
        <p>
          Something you would love to see here?{' '}
          <Link href="/contact" className="underline">Tell Dheeraj</Link>.
          He accepts ideas, bug reports, and reasonable amounts of flower enthusiasm.
        </p>
      </div>
    </main>
  )
}
