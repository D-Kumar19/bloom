'use client'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { ThemeDecoration } from '@/lib/themes/decorations'

type ThemeDecorationsProps = {
  decorations: ThemeDecoration[]
  dark?: boolean
  density?: 'backdrop' | 'scene'
  animate?: boolean
}

function HeartGlyph({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function LeafGlyph({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden fill="currentColor">
      <path d="M17 3C10 3 5 8.5 5 15c0 2.2.7 4.2 1.9 5.8-.3-2.5.2-5.2 1.8-7.5 2.2-3 5.8-4.8 9.3-4.3C15.2 5.8 13 8.8 13 12.5c0 4.1 3.4 7.5 7.5 7.5.5 0 1-.05 1.5-.15C21.2 17.2 22 14.2 22 11c0-4.4-2.2-8-5-8z" />
    </svg>
  )
}

function CloudGlyph({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 64 32" className={className} style={style} aria-hidden fill="currentColor">
      <path d="M18 24a10 10 0 0 1 0-20 12 12 0 0 1 23.2 3.2A9 9 0 1 1 52 24H18z" />
    </svg>
  )
}

function SparkleGlyph({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden fill="currentColor">
      <path d="M12 2l1.4 4.3L18 8l-4.6 1.7L12 14l-1.4-4.3L6 8l4.6-1.7L12 2zm7 11l.9 2.7L23 16l-3.1 1.1L19 20l-.9-2.9L15 16l3.1-1.2L19 13zm-14 3l.7 2.1L8 19l-2.3.8L5 22l-.7-2.2L2 19l2.3-.9L5 16z" />
    </svg>
  )
}

function BirdGlyph({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 48 24" className={className} style={style} aria-hidden fill="currentColor">
      <path d="M4 14c6-8 14-10 22-8 4 1 7 3 10 6-2-1-5-1-8 0-6 2-10 6-12 10-1-3 0-6 2-8zm28-2c4 0 8 2 12 6-3-1-6-1-9 0-3 1-5 3-6 5 1-4 2-7 3-11z" />
    </svg>
  )
}

const DECORATION_ITEMS = [
  { left: '6%', top: '10%', size: '2.4rem', delay: '0s', duration: '7s', anim: 'animate-scene-float' },
  { left: '88%', top: '14%', size: '2rem', delay: '1.1s', duration: '8.5s', anim: 'animate-scene-float-alt' },
  { left: '12%', top: '78%', size: '2.2rem', delay: '2.4s', duration: '9s', anim: 'animate-scene-float' },
  { left: '82%', top: '72%', size: '2.3rem', delay: '0.8s', duration: '7.5s', anim: 'animate-scene-float-alt' },
  { left: '44%', top: '6%', size: '3rem', delay: '1.8s', duration: '9s', anim: 'animate-scene-cloud' },
  { left: '70%', top: '8%', size: '2.6rem', delay: '3s', duration: '10s', anim: 'animate-scene-cloud' },
  { left: '20%', top: '42%', size: '1.9rem', delay: '2.8s', duration: '6s', anim: 'animate-scene-float' },
  { left: '76%', top: '44%', size: '2rem', delay: '1.4s', duration: '6.8s', anim: 'animate-scene-float-alt' },
  { left: '4%', top: '48%', size: '2.5rem', delay: '0.4s', duration: '11s', anim: 'animate-scene-bird' },
  { left: '90%', top: '52%', size: '2.1rem', delay: '2s', duration: '12s', anim: 'animate-scene-bird' },
  { left: '32%', top: '84%', size: '2.4rem', delay: '1.6s', duration: '8s', anim: 'animate-scene-float' },
  { left: '58%', top: '18%', size: '2rem', delay: '2.6s', duration: '7.2s', anim: 'animate-scene-float-alt' },
]

function toneForKind(kind: ThemeDecoration, dark: boolean): string {
  switch (kind) {
    case 'hearts':
      return dark ? 'text-brand-pink/90' : 'text-brand-pink/85'
    case 'leaves':
      return dark ? 'text-emerald-200/85' : 'text-emerald-700/80'
    case 'clouds':
      return dark ? 'text-white/75' : 'text-sky-200/90'
    case 'birds':
      return dark ? 'text-white/70' : 'text-bloom-ink/65'
    case 'sparkles':
      return dark ? 'text-amber-200/90' : 'text-amber-500/85'
    default:
      return dark ? 'text-white/60' : 'text-bloom-ink/55'
  }
}

export function ThemeDecorations({
  decorations,
  dark = false,
  density = 'backdrop',
  animate = true,
}: ThemeDecorationsProps) {
  const reducedMotion = usePrefersReducedMotion()

  if (decorations.length === 0) {
    return null
  }

  const items = density === 'scene' ? DECORATION_ITEMS : DECORATION_ITEMS.slice(0, 8)
  const scale = density === 'scene' ? 1 : 0.82
  const allowMotion = animate && !reducedMotion

  return (
    <div
      data-testid="theme-decorations"
      className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
      aria-hidden
    >
      {items.map((item, index) => {
        const kind = decorations[index % decorations.length]
        const motionClass = allowMotion ? item.anim : ''
        const size = `calc(${item.size} * ${scale})`
        const style = {
          left: item.left,
          top: item.top,
          width: kind === 'clouds' || kind === 'birds' ? `calc(${size} * 1.8)` : size,
          height: 'auto',
          animationDelay: item.delay,
          animationDuration: item.duration,
        } as React.CSSProperties
        const className = `absolute ${toneForKind(kind, dark)} ${motionClass}`

        if (kind === 'hearts') {
          return (
            <span key={index} data-testid={`theme-decoration-${kind}`} className={className} style={style}>
              <HeartGlyph className="h-full w-full" />
            </span>
          )
        }

        if (kind === 'leaves') {
          return (
            <span key={index} data-testid={`theme-decoration-${kind}`} className={className} style={style}>
              <LeafGlyph className="h-full w-full" />
            </span>
          )
        }

        if (kind === 'clouds') {
          return (
            <span key={index} data-testid={`theme-decoration-${kind}`} className={className} style={style}>
              <CloudGlyph className="h-full w-full" />
            </span>
          )
        }

        if (kind === 'birds') {
          return (
            <span key={index} data-testid={`theme-decoration-${kind}`} className={className} style={style}>
              <BirdGlyph className="h-full w-full" />
            </span>
          )
        }

        return (
          <span key={index} data-testid={`theme-decoration-${kind}`} className={className} style={style}>
            <SparkleGlyph className="h-full w-full" />
          </span>
        )
      })}
    </div>
  )
}
