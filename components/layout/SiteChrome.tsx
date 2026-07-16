'use client'

import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'

import { HeaderSlotContext } from '@/components/layout/HeaderSlotContext'
import { SiteHeader } from '@/components/layout/SiteHeader'

type SiteChromeProps = {
  children: ReactNode
}

export function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname()
  const immersive = pathname.startsWith('/bouquet')
  const [headerSlot, setHeaderSlot] = useState<ReactNode>(null)

  if (immersive) {
    return <>{children}</>
  }

  return (
    <HeaderSlotContext.Provider value={setHeaderSlot}>
      <SiteHeader slot={headerSlot} />
      {children}
    </HeaderSlotContext.Provider>
  )
}
