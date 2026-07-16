import type { FlowerColor } from '@/lib/flowers/flowerContent'

type FlowerColorBlockProps = {
  colors: FlowerColor[]
}

export function FlowerColorBlock({ colors }: FlowerColorBlockProps) {
  return (
    <section className="rounded-2xl border border-bloom-rose/15 bg-surface p-6">
      <h2 className="font-display text-xl text-bloom-ink">What the colors say</h2>
      <ul className="mt-4 space-y-3">
        {colors.map((color) => (
          <li key={color.name} className="flex items-start gap-3 text-sm">
            <span
              className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-bloom-rose/20"
              style={{ backgroundColor: color.swatch }}
              aria-hidden
            />
            <p className="text-bloom-ink/80">
              <span className="font-medium text-bloom-ink">{color.name}:</span> {color.meaning}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
