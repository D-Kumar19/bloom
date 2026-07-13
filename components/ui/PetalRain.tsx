'use client'

type PetalRainProps = {
  active?: boolean
}

export function PetalRain({ active = true }: PetalRainProps) {
  if (!active) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-3 w-3 rounded-full bg-bloom-rose/50 animate-petal-fall"
          style={{
            left: `${(i * 7 + 5) % 100}%`,
            animationDelay: `${i * 0.15}s`,
            animationDuration: `${2.5 + (i % 3) * 0.5}s`,
          }}
        />
      ))}
    </div>
  )
}
