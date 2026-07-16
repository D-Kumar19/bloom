'use client'

import { useId, type CSSProperties, type ReactNode } from 'react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { ThemeDecoration } from '@/lib/themes/decorations'

type ThemeDecorationsProps = {
  decorations: ThemeDecoration[]
  dark?: boolean
  density?: 'backdrop' | 'scene'
  animate?: boolean
}

type DecorationSlot = {
  kind: ThemeDecoration
  left: string
  top: string
  size: string
  delay: string
  duration: string
  anim: string
  flip?: boolean
  widthScale?: number
}

function HeartGlyph({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path
        fill="currentColor"
        d="M12 20.8s-6.9-4.4-8.8-8.1C1.6 9.6 3.1 6.2 6.4 5.2c1.8-.6 3.6.1 4.9 1.5 1.3-1.4 3.1-2.1 4.9-1.5 3.3 1 4.8 4.4 3.2 7.5-1.9 3.7-8.8 8.1-8.8 8.1z"
        opacity="0.92"
      />
    </svg>
  )
}

function LeafGlyph({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 32 48" className={className} style={style} aria-hidden>
      <path
        fill="currentColor"
        d="M16 2C9 8 5 16 5 25c0 8 4 15 11 21 7-6 11-13 11-21 0-9-4-17-11-23z"
        opacity="0.9"
      />
      <path
        d="M16 8v32"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M16 14c4 2 7 5 9 9M16 20c-3 2-6 5-8 9"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
        opacity="0.28"
      />
    </svg>
  )
}

function CloudGlyph({
  className = '',
  style,
  glyphId,
  dark = false,
}: {
  className?: string
  style?: CSSProperties
  glyphId: string
  dark?: boolean
}) {
  const blurId = `${glyphId}-cloud-soft`

  return (
    <svg viewBox="0 0 120 44" className={className} style={style} aria-hidden>
      <defs>
        <filter id={blurId} x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>
      <path
        d="M14 33c0-7.5 5.8-13.5 13.2-14.2 1.8-8.2 9.8-13.8 18.8-13.8 5.2 0 9.8 2 12.8 5.2 3.8-2.2 8.5-2.8 13-1.2 7.2 2.5 11.8 9.2 11.2 16.5 4.2 1.2 7 5 7 9.3 0 5.5-4.5 10-10 10H22c-5.8 0-10.5-4.4-10.5-9.8 0-4.5 2.8-8.3 6.8-9.5-.3-1.2-.3-2.5 0-3.7z"
        fill="currentColor"
        opacity={dark ? 0.5 : 0.78}
        filter={`url(#${blurId})`}
      />
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

function BirdGlyph({
  className = '',
  style,
  animateWings = false,
}: {
  className?: string
  style?: CSSProperties
  animateWings?: boolean
}) {
  const motionClass = animateWings ? 'bird-glide-bob' : ''

  return (
    <svg
      viewBox="0 0 72 24"
      className={[className, motionClass].filter(Boolean).join(' ')}
      style={style}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M2 14.5C12 10.5 20 9.5 28 12.5C36 8.5 46 8 54 11.5C62 9.5 68 11 70 14C62 14.5 54 14 48 15.5C42 17 34 16.5 26 16C18 16.5 10 15.5 2 14.5Z"
      />
    </svg>
  )
}

const HEART_SLOTS: Omit<DecorationSlot, 'kind'>[] = [
  { left: '6%', top: '10%', size: '2.4rem', delay: '0s', duration: '7s', anim: 'animate-scene-float' },
  { left: '88%', top: '14%', size: '2rem', delay: '1.1s', duration: '8.5s', anim: 'animate-scene-float-alt' },
  { left: '44%', top: '6%', size: '2.2rem', delay: '2.4s', duration: '9s', anim: 'animate-scene-float' },
  { left: '72%', top: '18%', size: '2rem', delay: '0.8s', duration: '7.5s', anim: 'animate-scene-float-alt' },
]

const LEAF_SLOTS: Omit<DecorationSlot, 'kind'>[] = [
  { left: '12%', top: '72%', size: '2.3rem', delay: '0.6s', duration: '8s', anim: 'animate-scene-float-alt' },
  { left: '82%', top: '78%', size: '2.1rem', delay: '1.8s', duration: '9.5s', anim: 'animate-scene-float' },
  { left: '24%', top: '58%', size: '1.9rem', delay: '2.8s', duration: '7.2s', anim: 'animate-scene-float' },
  { left: '64%', top: '84%', size: '2.2rem', delay: '1.2s', duration: '8.8s', anim: 'animate-scene-float-alt' },
]

const CLOUD_SLOTS: Omit<DecorationSlot, 'kind'>[] = [
  {
    left: '4%',
    top: '4%',
    size: '5.5rem',
    delay: '0s',
    duration: '42s',
    anim: 'animate-scene-cloud-drift',
    widthScale: 2.4,
  },
  {
    left: '48%',
    top: '8%',
    size: '4.2rem',
    delay: '14s',
    duration: '54s',
    anim: 'animate-scene-cloud-drift-slow',
    widthScale: 2.2,
  },
  {
    left: '72%',
    top: '2%',
    size: '3.6rem',
    delay: '26s',
    duration: '48s',
    anim: 'animate-scene-cloud-drift',
    widthScale: 2,
  },
]

const BIRD_SLOTS: Omit<DecorationSlot, 'kind'>[] = [
  {
    left: '-4%',
    top: '18%',
    size: '1.5rem',
    delay: '0s',
    duration: '24s',
    anim: 'animate-scene-bird-fly-east',
    widthScale: 1.7,
  },
  {
    left: '92%',
    top: '30%',
    size: '1.2rem',
    delay: '10s',
    duration: '28s',
    anim: 'animate-scene-bird-fly-west',
    flip: true,
    widthScale: 1.5,
  },
  {
    left: '38%',
    top: '10%',
    size: '1rem',
    delay: '16s',
    duration: '22s',
    anim: 'animate-scene-bird-fly-east',
    widthScale: 1.4,
  },
]

const SPARKLE_SLOTS: Omit<DecorationSlot, 'kind'>[] = [
  { left: '20%', top: '42%', size: '1.9rem', delay: '0s', duration: '6s', anim: 'animate-scene-float' },
  { left: '76%', top: '44%', size: '2rem', delay: '1.4s', duration: '6.8s', anim: 'animate-scene-float-alt' },
  { left: '32%', top: '84%', size: '2.4rem', delay: '1.6s', duration: '8s', anim: 'animate-scene-float' },
  { left: '58%', top: '18%', size: '2rem', delay: '2.6s', duration: '7.2s', anim: 'animate-scene-float-alt' },
]

function buildDecorationItems(
  decorations: ThemeDecoration[],
  density: 'backdrop' | 'scene',
): DecorationSlot[] {
  const items: DecorationSlot[] = []
  const scene = density === 'scene'

  for (const kind of decorations) {
    switch (kind) {
      case 'hearts':
        items.push(...HEART_SLOTS.slice(0, scene ? 4 : 2).map((slot) => ({ ...slot, kind })))
        break
      case 'leaves':
        items.push(...LEAF_SLOTS.slice(0, scene ? 4 : 2).map((slot) => ({ ...slot, kind })))
        break
      case 'clouds':
        items.push(...CLOUD_SLOTS.slice(0, scene ? 3 : 2).map((slot) => ({ ...slot, kind })))
        break
      case 'birds':
        items.push(...BIRD_SLOTS.slice(0, scene ? 3 : 2).map((slot) => ({ ...slot, kind })))
        break
      case 'sparkles':
        items.push(...SPARKLE_SLOTS.slice(0, scene ? 4 : 2).map((slot) => ({ ...slot, kind })))
        break
      default:
        break
    }
  }

  return items
}

function toneForKind(kind: ThemeDecoration, dark: boolean): string {
  switch (kind) {
    case 'hearts':
      return dark ? 'text-brand-pink/90' : 'text-brand-pink/80'
    case 'leaves':
      return dark ? 'text-emerald-200/80' : 'text-emerald-800/75'
    case 'clouds':
      return dark ? 'text-slate-300/90' : 'text-white'
    case 'birds':
      return dark ? 'text-slate-300/55' : 'text-slate-600/50'
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
  const glyphPrefix = useId().replace(/:/g, '')

  if (decorations.length === 0) {
    return null
  }

  const items = buildDecorationItems(decorations, density)
  const scale = density === 'scene' ? 1 : 0.82
  const allowMotion = animate && !reducedMotion

  return (
    <div
      data-testid="theme-decorations"
      className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
      aria-hidden
    >
      {items.map((item, index) => {
        const motionClass = allowMotion ? item.anim : ''
        const size = `calc(${item.size} * ${scale})`
        const widthScale = item.widthScale ?? 1
        const positionStyle = {
          left: item.left,
          top: item.top,
          width: `calc(${size} * ${widthScale})`,
          height: 'auto',
          animationDelay: item.delay,
          animationDuration: item.duration,
        } as CSSProperties
        const flipStyle = item.flip
          ? ({ transform: 'scaleX(-1)' } as CSSProperties)
          : undefined
        const className = [
          'absolute',
          toneForKind(item.kind, dark),
          motionClass,
        ]
          .filter(Boolean)
          .join(' ')

        const wrapGlyph = (glyph: ReactNode) =>
          item.flip ? (
            <span className="inline-block h-full w-full" style={flipStyle}>
              {glyph}
            </span>
          ) : (
            glyph
          )

        if (item.kind === 'hearts') {
          return (
            <span
              key={`${item.kind}-${index}`}
              data-testid={`theme-decoration-${item.kind}`}
              className={className}
              style={positionStyle}
            >
              {wrapGlyph(<HeartGlyph className="h-full w-full" />)}
            </span>
          )
        }

        if (item.kind === 'leaves') {
          return (
            <span
              key={`${item.kind}-${index}`}
              data-testid={`theme-decoration-${item.kind}`}
              className={className}
              style={positionStyle}
            >
              {wrapGlyph(<LeafGlyph className="h-full w-full" />)}
            </span>
          )
        }

        if (item.kind === 'clouds') {
          return (
            <span
              key={`${item.kind}-${index}`}
              data-testid={`theme-decoration-${item.kind}`}
              className={className}
              style={positionStyle}
            >
              {wrapGlyph(
                <CloudGlyph
                  glyphId={`${glyphPrefix}-cloud-${index}`}
                  dark={dark}
                  className="h-full w-full"
                />,
              )}
            </span>
          )
        }

        if (item.kind === 'birds') {
          return (
            <span
              key={`${item.kind}-${index}`}
              data-testid={`theme-decoration-${item.kind}`}
              className={className}
              style={positionStyle}
            >
              {wrapGlyph(
                <BirdGlyph animateWings={allowMotion} className="h-full w-full" />,
              )}
            </span>
          )
        }

        return (
          <span
            key={`${item.kind}-${index}`}
            data-testid={`theme-decoration-${item.kind}`}
            className={className}
            style={positionStyle}
          >
            {wrapGlyph(<SparkleGlyph className="h-full w-full" />)}
          </span>
        )
      })}
    </div>
  )
}
