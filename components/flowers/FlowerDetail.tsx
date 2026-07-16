import { Button } from '@/components/ui/Button'
import { FlowerColorBlock } from '@/components/flowers/FlowerColorBlock'
import { FlowerDetailHero } from '@/components/flowers/FlowerDetailHero'
import { RelatedFlowers } from '@/components/flowers/RelatedFlowers'
import { FLOWERS } from '@/lib/flowers'
import type { FlowerDetailContent } from '@/lib/flowers/flowerContent'
import type { Flower } from '@/lib/types'

type FlowerDetailProps = {
  flower: Flower
  content: FlowerDetailContent
}

export function FlowerDetail({ flower, content }: FlowerDetailProps) {
  const otherCount = FLOWERS.length - 1

  return (
    <article className="mx-auto max-w-2xl space-y-10 px-4 py-12 md:py-16">
      <FlowerDetailHero flower={flower} />

      <section>
        <p className="text-base leading-relaxed text-bloom-ink/80">{content.story}</p>
      </section>

      {content.colors ? <FlowerColorBlock colors={content.colors} /> : null}

      <section className="rounded-2xl border border-bloom-rose/15 bg-surface p-6">
        <h2 className="font-display text-xl text-bloom-ink">When to send</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-bloom-ink/80">
          {content.whenToSend.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-bloom-rose/15 bg-surface p-6">
        <h2 className="font-display text-xl text-bloom-ink">When not to send</h2>
        <p className="mt-2 text-xs text-bloom-ink/55">
          Bloom tries to be honest about what a flower can and cannot say.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-bloom-ink/80">
          {content.whenNotToSend.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="text-center">
        <p className="text-sm italic text-bloom-ink/70">{flower.fact}</p>
      </section>

      <div className="text-center">
        <Button href="/create" className="rounded-full px-8">
          Send a bouquet
        </Button>
      </div>

      <RelatedFlowers relatedIds={content.related} currentId={flower.id} />

      <footer className="border-t border-bloom-rose/10 pt-10 text-center">
        <p className="text-sm text-bloom-ink/60">
          {FLOWERS.length} blooms in Bloom. This one just felt right, though, didn&apos;t it.
        </p>
        <Button
          href="/flowers"
          variant="ghost"
          className="mt-4 rounded-full border-brand-pink/30 text-brand-pink"
        >
          Meet the other {otherCount} blooms
        </Button>
      </footer>
    </article>
  )
}
