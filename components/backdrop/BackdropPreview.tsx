'use client'

import { BackdropLayer } from '@/components/backdrop/BackdropLayer'
import { isThemeAnimated } from '@/lib/themes'
import type { Theme } from '@/lib/types'

type BackdropPreviewProps = {
  theme: Theme
  className?: string
  /** Larger previews (detail modal) show full decoration density. */
  decorationDensity?: 'backdrop' | 'scene'
  /** Show floating hearts, clouds, birds, and leaves. */
  showDecorations?: boolean
}

export function BackdropPreview({
  theme,
  className = '',
  decorationDensity = 'backdrop',
  showDecorations = true,
}: BackdropPreviewProps) {
  const animated = isThemeAnimated(theme)

  return (
    <BackdropLayer
      theme={theme}
      variant="preview"
      showMiniBouquet
      forceMotion={animated}
      decorationDensity={decorationDensity}
      showDecorations={showDecorations}
      animateDecorations={animated}
      className={`rounded-xl ${className}`}
    />
  )
}
