'use client'

import { BackdropLayer } from '@/components/backdrop/BackdropLayer'
import { isThemeAnimated } from '@/lib/themes'
import type { Theme } from '@/lib/types'

type BackdropPreviewProps = {
  theme: Theme
  className?: string
  /** Larger previews (detail modal) show full decoration density. */
  decorationDensity?: 'backdrop' | 'scene'
  /** Hide floating hearts/clouds in compact picker swatches. */
  showDecorations?: boolean
}

export function BackdropPreview({
  theme,
  className = '',
  decorationDensity = 'backdrop',
  showDecorations = true,
}: BackdropPreviewProps) {
  return (
    <BackdropLayer
      theme={theme}
      variant="preview"
      showMiniBouquet
      forceMotion={isThemeAnimated(theme)}
      decorationDensity={decorationDensity}
      showDecorations={showDecorations}
      className={`rounded-xl ${className}`}
    />
  )
}
