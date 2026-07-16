import Link from 'next/link'

import { FooterBrand } from '@/components/ui/FooterBrand'
import { getBouquetCount } from '@/lib/counter'
import { COPYRIGHT_LINE, PRE_RELEASE_PATH } from '@/lib/site'

export const dynamic = 'force-dynamic'

const footerLinkClass = 'text-bloom-ink/70 hover:text-brand-pink'

export async function Footer() {
  const bouquetCount = await getBouquetCount()

  return (
    <footer className="mt-auto border-t border-bloom-rose/15 bg-surface-muted px-4 py-8 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="hidden gap-10 lg:grid lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <FooterBrand initialCount={bouquetCount} />

          <div>
            <h2 className="font-display text-sm text-bloom-ink">Wander</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href={PRE_RELEASE_PATH} className={footerLinkClass}>
                  Flowers
                </Link>
              </li>
              <li>
                <Link href={PRE_RELEASE_PATH} className={footerLinkClass}>
                  Note styles
                </Link>
              </li>
              <li>
                <Link href={PRE_RELEASE_PATH} className={footerLinkClass}>
                  Backdrops
                </Link>
              </li>
              <li>
                <Link href={PRE_RELEASE_PATH} className={footerLinkClass}>
                  Ambient sound
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-sm text-bloom-ink">Create</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/create" className={footerLinkClass}>
                  New bouquet
                </Link>
              </li>
              <li>
                <Link href={PRE_RELEASE_PATH} className={footerLinkClass}>
                  Templates
                </Link>
              </li>
            </ul>
          </div>

          <div className="relative">
            <h2 className="font-display text-sm text-bloom-ink">Small print</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href={PRE_RELEASE_PATH} className={footerLinkClass}>
                  About
                </Link>
              </li>
              <li>
                <Link href={PRE_RELEASE_PATH} className={footerLinkClass}>
                  Privacy
                </Link>
              </li>
              <li>
                <Link href={PRE_RELEASE_PATH} className={footerLinkClass}>
                  Contact
                </Link>
              </li>
            </ul>
            <svg
              className="pointer-events-none absolute right-0 bottom-0 h-10 w-10 opacity-20"
              viewBox="0 0 40 40"
              aria-hidden
            >
              <path
                d="M20 4c8 6 12 14 8 22-4 8-14 10-20 4C2 24 4 12 12 8c2-1 5-2 8-4z"
                fill="currentColor"
                className="text-brand-pink"
              />
            </svg>
          </div>
        </div>

        <div className="lg:hidden">
          <FooterBrand initialCount={bouquetCount} />
        </div>

        <details className="mt-6 lg:hidden">
          <summary className="cursor-pointer text-sm font-medium text-bloom-ink/70">
            More links
          </summary>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <Link href={PRE_RELEASE_PATH} className="text-bloom-ink/70">
              Flowers
            </Link>
            <Link href={PRE_RELEASE_PATH} className="text-bloom-ink/70">
              Note styles
            </Link>
            <Link href={PRE_RELEASE_PATH} className="text-bloom-ink/70">
              See an example
            </Link>
            <Link href="/create" className="text-bloom-ink/70">
              New bouquet
            </Link>
            <Link href={PRE_RELEASE_PATH} className="text-bloom-ink/70">
              About
            </Link>
          </div>
        </details>

        <p className="mt-8 border-t border-bloom-rose/10 pt-6 text-center text-xs italic text-bloom-ink/60 lg:mt-10">
          {COPYRIGHT_LINE}
        </p>
      </div>
    </footer>
  )
}
