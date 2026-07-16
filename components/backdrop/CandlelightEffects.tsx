'use client'

type CandlelightEffectsProps = {
  className?: string
}

const GLOWWORMS = [
  { left: '14%', top: '62%', delay: '0s', duration: '7s' },
  { left: '28%', top: '48%', delay: '1.4s', duration: '8.5s' },
  { left: '68%', top: '58%', delay: '0.8s', duration: '9s' },
  { left: '82%', top: '44%', delay: '2.2s', duration: '7.5s' },
  { left: '52%', top: '72%', delay: '1.8s', duration: '8s' },
]

export function CandlelightEffects({ className = '' }: CandlelightEffectsProps) {
  return (
    <div
      data-testid="candlelight-effects"
      className={`pointer-events-none absolute inset-0 z-[2] overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 backdrop-candle-flicker" />
      <div className="absolute inset-0 backdrop-candle-wind" />

      {GLOWWORMS.map((worm, index) => (
        <span
          key={index}
          className="absolute h-1.5 w-1.5 rounded-full bg-amber-200/90 shadow-[0_0_10px_rgb(251_191_36/0.85)] animate-candle-glowworm"
          style={{
            left: worm.left,
            top: worm.top,
            animationDelay: worm.delay,
            animationDuration: worm.duration,
          }}
        />
      ))}
    </div>
  )
}
