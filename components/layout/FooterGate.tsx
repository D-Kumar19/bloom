'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

type FooterGateProps = {
  children: ReactNode
}

export function FooterGate({ children }: FooterGateProps) {
  const pathname = usePathname()
  const immersive = pathname.startsWith('/bouquet')

  if (immersive) {
    return null
  }

  return children
}
