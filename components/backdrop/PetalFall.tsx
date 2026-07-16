'use client'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type PetalFallProps = {
  count?: number
  className?: string
}

function PetalShape({
  className = '',
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 12 16"
      className={className}
      style={style}
      aria-hidden
      fill="currentColor"
    >
      <path d="M6 0.5 C9.2 4.2 10.5 9.5 6 15.5 C1.5 9.5 2.8 4.2 6 0.5 Z" />
    </svg>
  )
}

export function PetalFall({ count = 12, className = '' }: PetalFallProps) {
  const reducedMotion = usePrefersReducedMotion()

  if (reducedMotion) {
    return (
      <div
        className={`pointer-events-none absolute inset-0 overflow-hidden opacity-40 ${className}`}
        aria-hidden
      >
        <PetalShape className="absolute top-[18%] left-[22%] h-3 w-2.5 text-bloom-rose/50" />
        <PetalShape className="absolute top-[35%] right-[20%] h-2.5 w-2 text-bloom-rose/40" />
        <PetalShape className="absolute bottom-[30%] left-[40%] h-2 w-1.5 text-bloom-rose/35" />
      </div>
    )
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, index) => (
        <PetalShape
          key={index}
          className="absolute text-bloom-rose/55 animate-backdrop-petal"
          style={{
            left: `${(index * 13 + 4) % 96}%`,
            width: `${0.45 + (index % 3) * 0.2}rem`,
            height: `${0.6 + (index % 4) * 0.15}rem`,
            animationDelay: `${index * 0.55}s`,
            animationDuration: `${3.8 + (index % 5) * 0.6}s`,
          }}
        />
      ))}
    </div>
  )
}
