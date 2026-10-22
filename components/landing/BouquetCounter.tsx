'use client'

import { useEffect, useState } from 'react'

type BouquetCounterProps = {
  initialCount: number | null
  compact?: boolean
}

export function BouquetCounter({
  initialCount,
  compact = false,
}: BouquetCounterProps) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (initialCount === null) {
      return
    }
    const duration = 1200
    const start = performance.now()
    const target = initialCount

    let frame: number
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setDisplay(Math.round(target * progress))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [initialCount])

  const formatted = display.toLocaleString()

  return (
    <p
      className={
        compact ? 'text-xs text-bloom-ink/65' : 'mt-6 text-lg text-bloom-ink/80'
      }
    >
      {initialCount === null ? (
        'Bouquet count temporarily unavailable'
      ) : (
        <>
          <span
            className={`inline-block font-display text-brand-pink ${
              compact ? 'text-base' : 'animate-pulse text-2xl'
            }`}
          >
            {formatted}
          </span>{' '}
          {initialCount === 0
            ? 'Be the first to prepare a bouquet to share'
            : 'bouquets prepared to share'}
        </>
      )}
    </p>
  )
}
