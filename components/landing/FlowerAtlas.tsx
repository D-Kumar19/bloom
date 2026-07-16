import { FlowerCatalogCard } from '@/components/flowers/FlowerCatalogCard'
import { Button } from '@/components/ui/Button'
import { FLOWERS } from '@/lib/flowers'

const PREVIEW_COUNT = 8
const previewFlowers = FLOWERS.slice(0, PREVIEW_COUNT)
const remainingCount = FLOWERS.length - PREVIEW_COUNT

export function FlowerAtlas() {
  return (
    <section id="flowers" className="scroll-mt-28 border-y border-bloom-rose/10 bg-surface-muted px-4 py-14 md:py-18">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl text-bloom-ink md:text-4xl">
            The language of Bloom
          </h2>
          <p className="mt-3 text-sm text-bloom-ink/65">
            Each bloom says something. Here are eight to start.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          {previewFlowers.map((flower) => (
            <FlowerCatalogCard key={flower.id} flower={flower} />
          ))}
        </div>

        {remainingCount > 0 ? (
          <div className="mt-10 text-center">
            <Button
              href="/flowers"
              variant="ghost"
              className="rounded-full border-brand-pink/30 px-6 text-sm text-brand-pink"
            >
              {remainingCount} more blooms are being shy. Show me all of them
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
