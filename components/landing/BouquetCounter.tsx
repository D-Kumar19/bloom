'use client'

import { useEffect, useState } from 'react'

type BouquetCounterProps = {
  initialCount: number
}

export function BouquetCounter({ initialCount }: BouquetCounterProps) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const duration = 1200
    const start = performance.now()
    const target = initialCount

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setDisplay(Math.round(target * progress))
      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [initialCount])

  const formatted = display.toLocaleString()

  return (
    <p className="mt-6 text-lg text-bloom-ink/80">
      <span className="inline-block animate-pulse font-display text-2xl text-brand-pink">
        {formatted}
      </span>{' '}
      {initialCount === 0
        ? 'Be the first to send a bouquet with love'
        : 'bouquets sent with love'}
    </p>
  )
}
