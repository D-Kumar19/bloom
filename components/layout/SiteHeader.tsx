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
      className="sticky top-0 z-40 border-b border-bloom-rose/12 bg-background/92 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3.5 md:px-6">
        <BloomLogo />

        <div className="ml-auto flex items-center gap-2.5 sm:gap-3">
          <CompactThemeToggle />
          <Button
            href="/create"
            className={`rounded-full px-5 py-2 text-sm ${
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
          className="border-t border-bloom-rose/10 bg-background/92 px-4 py-3 md:px-6"
        >
          <div className="mx-auto max-w-6xl">{slot}</div>
        </div>
      ) : null}
    </header>
  )
}
