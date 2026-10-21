'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { BloomLogo } from '@/components/ui/BloomLogo'
import { Button } from '@/components/ui/Button'
import { CompactThemeToggle } from '@/components/ui/CompactThemeToggle'

type SiteHeaderProps = {
  slot?: ReactNode
}

export function SiteHeader({ slot }: SiteHeaderProps) {
  const pathname = usePathname()
  const onCreate = pathname.startsWith('/create')

  return (
    <header
      data-testid="site-header"
      className="bloom-header sticky top-0 z-40"
    >
      <div className="bloom-header__bar">
        <BloomLogo />
        <p className="bloom-header__tagline">A small gesture. A lot of feeling.</p>
        <div className="ml-auto flex items-center gap-2.5 sm:gap-3">
          <CompactThemeToggle />
          <Button
            href="/create"
            className={`px-5 py-2 text-sm ${
              onCreate ? 'ring-2 ring-brand-pink/20' : ''
            }`}
          >
            Create Bouquet
          </Button>
        </div>
      </div>

      {slot ? (
        <div
          data-testid="header-slot"
          className="bloom-header__progress px-4 py-3 md:px-6"
        >
          <div className="mx-auto max-w-6xl">{slot}</div>
        </div>
      ) : null}
    </header>
  )
}
