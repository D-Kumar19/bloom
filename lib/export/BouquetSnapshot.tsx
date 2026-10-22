import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'

import { BackdropLayer } from '@/components/backdrop/BackdropLayer'
import { BouquetHero } from '@/components/bouquet/BouquetHero'
import { MessageCard } from '@/components/cards/MessageCard'
import { shouldShowNoteCard } from '@/lib/message'
import type { BouquetState } from '@/lib/types'

export function BouquetSnapshot({ bouquet }: { bouquet: BouquetState }) {
  return (
    <BackdropLayer theme={bouquet.theme} animateDecorations={false} className="export-static">
      <div className="flex flex-col gap-6 p-10" style={{ width: 720 }}>
        <BouquetHero bouquetId={bouquet.bouquetId} theme={bouquet.theme} showBackdrop={false} />
        {shouldShowNoteCard(bouquet.message) ? (
          <MessageCard
            styleId={bouquet.cardStyle}
            to={bouquet.to}
            message={bouquet.message}
            from={bouquet.from}
            messageFormat={bouquet.messageFormat}
            noteBorder={bouquet.noteBorder}
            className="mx-auto w-full max-w-md"
          />
        ) : null}
      </div>
    </BackdropLayer>
  )
}

// html2canvas predates CSS Color 4. Normalize colors only in its private clone;
// never flatten away the gift's gradients, borders, or rich-text styling.
export function normalizeCaptureColors(doc: Document): void {
  const context = doc.createElement('canvas').getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Canvas is not available')
  const normalize = (value: string) => value
    .replace(/\s+in\s+(?:oklab|oklch|srgb)(?:\s+longer\s+hue)?/gi, '')
    .replace(/color-mix\([^()]*(?:\([^()]*\)[^()]*)*\)|(?:oklab|oklch|lab|lch|color)\([^()]*\)/gi, (color) => {
      context.clearRect(0, 0, 1, 1)
      context.fillStyle = color
      context.fillRect(0, 0, 1, 1)
      const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data
      return `rgba(${r}, ${g}, ${b}, ${a / 255})`
    })
  const view = doc.defaultView
  if (!view) throw new Error('Capture document is unavailable')
  for (const element of doc.querySelectorAll<HTMLElement>('*')) {
    const computed = view.getComputedStyle(element)
    for (const property of Array.from(computed)) {
      if (property.startsWith('--')) continue
      const value = computed.getPropertyValue(property)
      const normalized = normalize(value)
      if (value !== normalized) element.style.setProperty(property, normalized, 'important')
    }
  }
}

export async function captureBouquetSnapshot(bouquet: BouquetState): Promise<Blob> {
  const host = document.createElement('div')
  host.setAttribute('aria-hidden', 'true')
  host.style.cssText = 'position:absolute;left:-10000px;top:0;width:720px;pointer-events:none'
  document.body.appendChild(host)
  const root = createRoot(host)
  try {
    flushSync(() => root.render(<BouquetSnapshot bouquet={bouquet} />))
    await document.fonts.ready
    await Promise.all(Array.from(host.querySelectorAll('img'), async image => {
      await image.decode()
      if (!image.naturalWidth) throw new Error('Bouquet image could not be loaded')
    }))
    const element = host.firstElementChild
    if (!(element instanceof HTMLElement)) throw new Error('Gift snapshot is unavailable')
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
      allowTaint: false,
      logging: false,
      windowWidth: 720,
      onclone: normalizeCaptureColors,
    })
    if (!canvas.width || !canvas.height) throw new Error('Gift snapshot is empty')
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
    if (!blob) throw new Error('Could not encode gift image')
    return blob
  } finally {
    root.unmount()
    host.remove()
  }
}
