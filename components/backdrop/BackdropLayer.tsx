'use client'

import { getThemeById, isThemeAnimated } from '@/lib/themes'
import { getThemeDecorations } from '@/lib/themes/decorations'
import type { BackdropLightPosition, BackdropMotion, Theme } from '@/lib/types'

import { MiniBouquetSilhouette } from './MiniBouquetSilhouette'
import { PetalFall } from './PetalFall'
import { ThemeDecorations } from './ThemeDecorations'

export type BackdropVariant = 'full' | 'muted' | 'preview'

const MOTION_CLASS: Partial<Record<Exclude<BackdropMotion, 'none'>, string>> = {
  breathe: 'backdrop-motion-breathe',
  'glow-drift': 'backdrop-motion-glow-drift',
  'wave-shift': 'backdrop-motion-wave-shift',
  'blur-pulse': 'backdrop-motion-blur-pulse',
  twinkle: 'backdrop-motion-glow-drift',
  'pollen-float': 'backdrop-motion-breathe',
}

type BackdropLayerProps = {
  theme: Theme | string
  variant?: BackdropVariant
  showMiniBouquet?: boolean
  forceMotion?: boolean
  decorationDensity?: 'backdrop' | 'scene'
  showDecorations?: boolean
  className?: string
  children?: React.ReactNode
  'data-testid'?: string
}

const LIGHT_POSITION_CLASS: Record<BackdropLightPosition, string> = {
  top: 'backdrop-light-top',
  'top-left': 'backdrop-light-top-left',
  center: 'backdrop-light-center',
  bottom: 'backdrop-light-bottom',
}

const ACCENT_POSITION_CLASS: Record<
  NonNullable<Theme['accentAt']>,
  string
> = {
  'bottom-left': 'backdrop-accent-bottom-left',
  'bottom-right': 'backdrop-accent-bottom-right',
  'top-right': 'backdrop-accent-top-right',
  center: 'backdrop-accent-center',
}

function resolveTheme(theme: Theme | string): Theme | undefined {
  return typeof theme === 'string' ? getThemeById(theme) : theme
}

function hasEffect(theme: Theme, effect: NonNullable<Theme['effects']>[number]) {
  return theme.effects?.includes(effect) ?? false
}

export function BackdropLayer({
  theme,
  variant = 'full',
  showMiniBouquet = false,
  forceMotion = false,
  decorationDensity,
  showDecorations = true,
  className = '',
  children,
  'data-testid': dataTestId,
}: BackdropLayerProps) {
  const resolved = resolveTheme(theme)

  if (!resolved) {
    return (
      <div className={`relative bg-bloom-cream ${className}`}>{children}</div>
    )
  }

  const lightClass = LIGHT_POSITION_CLASS[resolved.lightPosition ?? 'top-left']
  const accentClass = ACCENT_POSITION_CLASS[resolved.accentAt ?? 'bottom-left']
  const motion = resolved.motion ?? 'none'
  const motionClass = motion !== 'none' ? MOTION_CLASS[motion] : undefined
  const enableMotion =
    forceMotion || variant === 'full' || variant === 'preview'
  const decorationsDensity =
    decorationDensity ?? (variant === 'preview' ? 'backdrop' : 'scene')
  const animateDecorations = isThemeAnimated(resolved)

  return (
    <div
      data-testid={dataTestId ?? `backdrop-layer-${resolved.id}`}
      data-backdrop-variant={variant}
      className={`relative overflow-hidden ${resolved.className} ${
        resolved.dark ? 'text-white' : ''
      } ${variant === 'muted' ? 'backdrop-muted' : ''} ${className}`}
      style={
        {
          '--backdrop-light': resolved.lightTint ?? 'rgb(255 255 255 / 0.5)',
          '--backdrop-accent': resolved.accentTint ?? 'transparent',
        } as React.CSSProperties
      }
    >
      <div className={`pointer-events-none absolute inset-0 ${lightClass}`} aria-hidden />
      <div className={`pointer-events-none absolute inset-0 ${accentClass}`} aria-hidden />

      {hasEffect(resolved, 'grain') ? (
        <div className="pointer-events-none absolute inset-0 backdrop-grain" aria-hidden />
      ) : null}

      {hasEffect(resolved, 'vignette') ? (
        <div
          className={`pointer-events-none absolute inset-0 ${
            resolved.dark ? 'backdrop-vignette-dark' : 'backdrop-vignette'
          }`}
          aria-hidden
        />
      ) : null}

      {enableMotion && motionClass ? (
        <div className={`pointer-events-none absolute inset-0 ${motionClass}`} aria-hidden />
      ) : null}

      {hasEffect(resolved, 'petals') ? <PetalFall /> : null}

      {hasEffect(resolved, 'stars') ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className="absolute h-1 w-1 rounded-full bg-white/70 animate-backdrop-twinkle"
              style={{
                left: `${12 + index * 14}%`,
                top: `${18 + (index % 3) * 22}%`,
                animationDelay: `${index * 0.9}s`,
              }}
            />
          ))}
        </div>
      ) : null}

      {hasEffect(resolved, 'pollen') ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className="absolute h-1.5 w-1.5 rounded-full bg-bloom-gold/45 animate-backdrop-pollen"
              style={{
                left: `${20 + index * 16}%`,
                top: `${30 + (index % 2) * 25}%`,
                animationDelay: `${index * 1.4}s`,
              }}
            />
          ))}
        </div>
      ) : null}

      {showDecorations ? (
        <ThemeDecorations
          decorations={getThemeDecorations(resolved.id)}
          dark={resolved.dark}
          density={decorationsDensity}
          animate={animateDecorations}
        />
      ) : null}

      {showMiniBouquet ? (
        <MiniBouquetSilhouette dark={resolved.dark} />
      ) : null}

      {children ? <div className="relative z-10 h-full min-h-0">{children}</div> : null}
    </div>
  )
}
