'use client'

import { useContext, useEffect } from 'react'
import type { ReactNode } from 'react'

import { HeaderSlotContext } from '@/components/layout/HeaderSlotContext'

/** Renders content in the sticky site header. Returns true when attached. */
export function useHeaderSlot(content: ReactNode): boolean {
  const setSlot = useContext(HeaderSlotContext)
  const attached = Boolean(setSlot)

  useEffect(() => {
    if (!setSlot) {
      return
    }

    setSlot(content)
    return () => setSlot(null)
  }, [content, setSlot])

  return attached
}
