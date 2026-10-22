import Link from 'next/link'
import { connection } from 'next/server'

import { FooterBrand } from '@/components/ui/FooterBrand'
import { getBouquetCount } from '@/lib/counter'
import { COPYRIGHT_LINE } from '@/lib/site'

const sections = [
  { title: 'Wander', items: [
    { label: 'Flowers' }, { label: 'Note styles' }, { label: 'Backdrops' }, { label: 'Ambient sound' },
  ] },
  { title: 'Create', items: [
    { label: 'New bouquet', href: '/create' }, { label: 'Templates' },
  ] },
  { title: 'Small print', items: [
    { label: 'About', href: '/about' }, { label: 'Privacy', href: '/privacy' }, { label: 'Contact' },
  ] },
] satisfies { title: string; items: { label: string; href?: string }[] }[]

function FooterLinks() {
  return sections.map(section => (
    <div key={section.title}>
      <h2 className="font-display text-sm text-bloom-ink">{section.title}</h2>
      {section.title === 'Wander' ? (
        <p className="mt-2 text-xs text-bloom-ink/70">
          Standalone guides are not ready. These choices are available in the builder.
        </p>
      ) : null}
      <ul className="mt-3 space-y-2 text-sm">
        {section.items.map(item => (
          <li key={item.label}>
            {'href' in item && item.href ? (
              <Link href={item.href} className="text-bloom-ink/80 hover:underline">{item.label}</Link>
            ) : (
              <span className="text-bloom-ink/70">{item.label} <span className="text-xs">(not available yet)</span></span>
            )}
          </li>
        ))}
      </ul>
    </div>
  ))
}

export async function Footer() {
  await connection()
  const bouquetCount = await getBouquetCount()
  return (
    <footer className="mt-auto border-t border-bloom-rose/15 bg-surface-muted px-4 py-8 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="hidden gap-10 lg:grid lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <FooterBrand initialCount={bouquetCount} />
          <FooterLinks />
        </div>
        <div className="lg:hidden"><FooterBrand initialCount={bouquetCount} /></div>
        <details className="mt-6 lg:hidden">
          <summary className="cursor-pointer text-sm font-medium text-bloom-ink/80">More links</summary>
          <div className="mt-4 grid grid-cols-2 gap-4"><FooterLinks /></div>
        </details>
        <p className="mt-8 border-t border-bloom-rose/10 pt-6 text-center text-xs italic text-bloom-ink/70 lg:mt-10">
          {COPYRIGHT_LINE}
        </p>
      </div>
    </footer>
  )
}
