'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { getFlowerById } from '@/lib/flowers'
import { getGreeneryById } from '@/lib/flowers'
import { assignFlowersToSlots } from '@/lib/composition'
import { getThemeById } from '@/lib/themes'
import type { BouquetState } from '@/lib/types'

type BouquetCompositionProps = {
  state: Pick<BouquetState, 'flowers' | 'greenery' | 'theme'>
  className?: string
  id?: string
  animate?: boolean
  revealUnwrap?: boolean
}

export function BouquetComposition({
  state,
  className = '',
  id,
  animate = false,
  revealUnwrap = false,
}: BouquetCompositionProps) {
  const greenery = getGreeneryById(state.greenery)
  const theme = getThemeById(state.theme)
  const placed = assignFlowersToSlots(state.flowers)
  const [flowersVisible, setFlowersVisible] = useState(!revealUnwrap)

  useEffect(() => {
    if (!revealUnwrap) {
      return
    }
    const timer = window.setTimeout(() => setFlowersVisible(true), 900)
    return () => window.clearTimeout(timer)
  }, [revealUnwrap])

  return (
    <div
      id={id}
      data-testid="bouquet-composition"
      className={`relative mx-auto aspect-[3/4] w-full max-w-md overflow-visible rounded-3xl p-6 ${theme?.className ?? 'bg-bloom-cream'} ${className}`}
    >
      {theme?.animated ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-2 w-2 rounded-full bg-bloom-rose/40 animate-petal"
              style={{
                left: `${10 + i * 15}%`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>
      ) : null}

      {greenery ? (
        <Image
          src={greenery.image}
          alt=""
          width={400}
          height={500}
          className="absolute bottom-[8%] left-1/2 w-[92%] -translate-x-1/2 object-contain"
          priority
        />
      ) : null}

      {flowersVisible
        ? placed
            .sort((a, b) => a.slot.z - b.slot.z)
            .map((item, index) => {
          const flower = getFlowerById(item.flowerId)
          if (!flower) {
            return null
          }

          return (
            <div
              key={`${item.flowerId}-${index}`}
              data-testid="placed-flower"
              className={`absolute ${animate ? 'animate-bloom-in' : ''}`}
              style={{
                left: `${item.slot.x}%`,
                top: `${item.slot.y}%`,
                zIndex: item.slot.z + 10,
                transform: `translate(-50%, -50%) rotate(${item.slot.rotation}deg) scale(${item.slot.scale})`,
                animationDelay: animate ? `${index * 0.12}s` : undefined,
              }}
            >
              <Image
                src={flower.image}
                alt={flower.name}
                width={120}
                height={120}
                className="h-16 w-16 object-contain drop-shadow-md md:h-24 md:w-24"
                style={{
                  width: placed.length > 12 ? '2.5rem' : placed.length > 8 ? '3rem' : undefined,
                  height: placed.length > 12 ? '2.5rem' : placed.length > 8 ? '3rem' : undefined,
                }}
              />
            </div>
          )
        })
        : null}
    </div>
  )
}
