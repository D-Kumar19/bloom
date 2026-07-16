import { BouquetCounter } from '@/components/landing/BouquetCounter'
import { Button } from '@/components/ui/Button'
import { getBouquetCount } from '@/lib/counter'
import { HOME_PRIVACY_LINE } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const bouquetCount = await getBouquetCount()

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-20 text-center md:py-28">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-bloom-ink/45">
          Digital bouquets
        </p>
        <h1 className="mt-6 font-display text-4xl leading-tight text-bloom-ink md:text-6xl">
          Bloom turns a feeling into a link
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-bloom-ink/65 md:text-lg">
          Pick a bouquet with meaning, write a note, share a private link, for when
          &quot;thinking of you&quot; feels too small to type.
        </p>
        <BouquetCounter initialCount={bouquetCount} />
        <Button href="/create" className="mt-10 rounded-full px-10 py-3 text-base">
          Create your bouquet
        </Button>
        <p className="mx-auto mt-5 max-w-sm text-xs leading-relaxed text-bloom-ink/45">
          {HOME_PRIVACY_LINE}
        </p>
      </section>
    </main>
  )
}
