import { MessageCard } from '@/components/cards/MessageCard'
import { DiscoveryPage } from '@/components/discovery/DiscoveryPage'
import { CARD_STYLES } from '@/lib/cards'
import { publicPageMetadata } from '@/lib/pageMetadata'

export const metadata = publicPageMetadata({
  title: 'Note styles',
  description:
    'Preview Bloom stationery, from classic cream to watercolor, and find a home for your own words.',
  path: '/note-styles',
})

export default function NoteStylesPage() {
  return (
    <DiscoveryPage
      title="A home for your words"
      introduction="The paper sets the tone; your note makes it personal. Browse the actual stationery below, then choose a style in the builder. Names and words here are examples, never a message we fill in for you."
    >
      <div className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CARD_STYLES.map((card) => (
          <article key={card.id} className="min-w-0 rounded-3xl border border-bloom-rose/15 bg-surface p-4">
            <MessageCard styleId={card.id} to="You" from="Someone who cares" message="A small note, just for you." compact />
            <h2 className="mt-4 font-display text-2xl">{card.name}</h2>
            <p className="mt-2 text-sm text-bloom-ink/75">{card.tagline}</p>
          </article>
        ))}
      </div>
      <section className="mt-8 max-w-2xl space-y-3">
        <h2 className="font-display text-2xl">Make it sound like you</h2>
        <p className="text-sm leading-relaxed text-bloom-ink/80">
          In the builder, change the type, size, and color, add emphasis or line breaks,
          and try an optional border. The live preview shows your actual note.
          Start with just 2 words or use up to 200 words; sincerity does not need to fill the page.
        </p>
      </section>
    </DiscoveryPage>
  )
}
