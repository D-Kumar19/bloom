import { ExampleGallery } from '@/components/landing/ExampleGallery'

export function BouquetsToday() {
  return (
    <section id="examples" className="scroll-mt-28 border-y border-bloom-rose/10 bg-surface px-4 py-14 md:py-18">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-2 text-center font-display text-3xl text-bloom-ink md:text-4xl">
          Bouquets that landed today
        </h2>
        <p className="mb-8 text-center text-sm text-bloom-ink/60">
          Anonymous examples you can open, read, and recreate.
        </p>
        <ExampleGallery />
      </div>
    </section>
  )
}
