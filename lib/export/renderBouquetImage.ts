import { getNoteBorderStyle } from '@/lib/cards/noteBorder'
import { getBouquetById } from '@/lib/bouquets'
import { shouldShowNoteCard, stripMessageHtml } from '@/lib/message'
import type { BouquetState, MessageFormat } from '@/lib/types'

const EXPORT_WIDTH = 1080
const EXPORT_SCALE = 2
const PADDING_TOP = 88
const PADDING_BOTTOM = 88
const BOUQUET_WIDTH = 720
const BOUQUET_ASPECT = 4 / 5
const CARD_WIDTH = 920
const CARD_PADDING = 52
const CARD_RADIUS = 32
const FRAME_RADIUS = 28
const SECTION_GAP = 56
const BACKGROUND = '#faf7f2'

const CARD_SURFACES: Record<string, { background: string; text: string }> = {
  'classic-cream': { background: '#fff8f0', text: '#2a2420' },
  vintage: { background: '#f3e6c8', text: '#2a2420' },
  midnight: { background: '#1a1a2e', text: '#ffffff' },
  'rose-gold': { background: '#f5c6c6', text: '#2a2420' },
  watercolor: { background: '#fff0f5', text: '#2a2420' },
  kraft: { background: '#c4a882', text: '#2a2420' },
  garden: { background: '#e8f5e9', text: '#2a2420' },
  blush: { background: '#fff0f3', text: '#2a2420' },
  linen: { background: '#faf8f5', text: '#2a2420' },
}

const MESSAGE_FONT_FAMILIES: Record<string, string> = {
  inter: 'Inter',
  nunito: 'Nunito',
  raleway: 'Raleway',
  playfair: '"Playfair Display"',
  lora: 'Lora',
  'eb-garamond': '"EB Garamond"',
  georgia: 'Georgia',
  caveat: 'Caveat',
  sacramento: 'Sacramento',
  courier: '"Courier Prime"',
}

const MESSAGE_FONT_SIZES: Record<MessageFormat['fontSize'], number> = {
  sm: 34,
  base: 38,
  lg: 44,
}

function resolveImageSrc(src: string): string {
  try {
    return new URL(src, window.location.href).href
  } catch {
    return src
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    image.src = src
  })
}

async function fetchImageDataUrl(src: string): Promise<string> {
  const response = await fetch(resolveImageSrc(src))
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${src}`)
  }

  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Could not read image data'))
    }
    reader.onerror = () => reject(reader.error ?? new Error('Could not read image data'))
    reader.readAsDataURL(blob)
  })
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const paragraphs = text.split('\n')
  const lines: string[] = []

  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean)
    if (words.length === 0) {
      lines.push('')
      continue
    }

    let current = words[0] ?? ''
    for (const word of words.slice(1)) {
      const next = `${current} ${word}`
      if (context.measureText(next).width <= maxWidth) {
        current = next
        continue
      }

      lines.push(current)
      current = word
    }

    lines.push(current)
  }

  return lines
}

export function computeImageCoverCrop(
  srcWidth: number,
  srcHeight: number,
  destWidth: number,
  destHeight: number,
): { sx: number; sy: number; sw: number; sh: number } {
  const scale = Math.max(destWidth / srcWidth, destHeight / srcHeight)
  const sw = destWidth / scale
  const sh = destHeight / scale

  return {
    sx: (srcWidth - sw) / 2,
    sy: (srcHeight - sh) / 2,
    sw,
    sh,
  }
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  destX: number,
  destY: number,
  destWidth: number,
  destHeight: number,
): void {
  const srcWidth = image.naturalWidth || image.width
  const srcHeight = image.naturalHeight || image.height
  const crop = computeImageCoverCrop(srcWidth, srcHeight, destWidth, destHeight)

  context.drawImage(
    image,
    crop.sx,
    crop.sy,
    crop.sw,
    crop.sh,
    destX,
    destY,
    destWidth,
    destHeight,
  )
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const r = Math.min(radius, width / 2, height / 2)
  context.beginPath()
  context.moveTo(x + r, y)
  context.lineTo(x + width - r, y)
  context.quadraticCurveTo(x + width, y, x + width, y + r)
  context.lineTo(x + width, y + height - r)
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  context.lineTo(x + r, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - r)
  context.lineTo(x, y + r)
  context.quadraticCurveTo(x, y, x + r, y)
  context.closePath()
}

function getCardSurface(styleId: string) {
  return CARD_SURFACES[styleId] ?? CARD_SURFACES['classic-cream']
}

function fillCardSurface(
  context: CanvasRenderingContext2D,
  styleId: string,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  drawRoundedRect(context, x, y, width, height, radius)

  if (styleId === 'rose-gold') {
    const gradient = context.createLinearGradient(x, y, x + width, y + height)
    gradient.addColorStop(0, '#f5c6c6')
    gradient.addColorStop(0.5, '#daa520')
    gradient.addColorStop(1, '#f5c6c6')
    context.fillStyle = gradient
  } else if (styleId === 'watercolor') {
    const gradient = context.createLinearGradient(x, y, x + width, y + height)
    gradient.addColorStop(0, '#fff0f5')
    gradient.addColorStop(0.55, '#f0f8ff')
    gradient.addColorStop(1, '#f5fff0')
    context.fillStyle = gradient
  } else {
    context.fillStyle = getCardSurface(styleId).background
  }

  context.fill()
}

function getMessageFont(messageFormat?: MessageFormat): string {
  const family =
    MESSAGE_FONT_FAMILIES[messageFormat?.fontFamily ?? 'inter'] ?? MESSAGE_FONT_FAMILIES.inter
  const size = MESSAGE_FONT_SIZES[messageFormat?.fontSize ?? 'base']
  return `${size}px ${family}, sans-serif`
}

function getMessageColor(messageFormat: MessageFormat | undefined, fallback: string): string {
  const color = messageFormat?.color
  if (!color || color === '#000000') {
    return fallback
  }

  return color
}

function measureNoteCardHeight(
  context: CanvasRenderingContext2D,
  bouquet: BouquetState,
): number {
  const innerWidth = CARD_WIDTH - CARD_PADDING * 2
  let height = CARD_PADDING

  context.font = `600 42px Fraunces, Georgia, serif`
  height += 52

  const message = stripMessageHtml(bouquet.message).trim()
  if (message) {
    context.font = getMessageFont(bouquet.messageFormat)
    const lines = wrapText(context, message, innerWidth)
    const lineHeight = MESSAGE_FONT_SIZES[bouquet.messageFormat?.fontSize ?? 'base'] * 1.45
    height += lines.length * lineHeight + 28
  }

  context.font = `600 36px ${MESSAGE_FONT_FAMILIES.inter}, sans-serif`
  height += 52

  height += CARD_PADDING
  return height
}

async function ensureFontsReady(): Promise<void> {
  const fontFaces = [
    '600 42px Fraunces',
    '500 34px Fraunces',
    '600 36px Inter',
    '400 38px Inter',
    '400 38px "Playfair Display"',
    '400 38px Caveat',
  ]

  await Promise.all(fontFaces.map((face) => document.fonts.load(face)))
  await document.fonts.ready
}

export async function renderBouquetImage(bouquet: BouquetState): Promise<Blob> {
  const bouquetMeta = getBouquetById(bouquet.bouquetId)
  if (!bouquetMeta) {
    throw new Error('Bouquet not found')
  }

  await ensureFontsReady()

  const imageDataUrl = await fetchImageDataUrl(bouquetMeta.heroImage)
  const bouquetImage = await loadImage(imageDataUrl)
  const hasNote = shouldShowNoteCard(bouquet.message)
  const surface = getCardSurface(bouquet.cardStyle)

  const measureCanvas = document.createElement('canvas')
  const measureContext = measureCanvas.getContext('2d')
  if (!measureContext) {
    throw new Error('Canvas is not available')
  }

  const bouquetImageHeight = BOUQUET_WIDTH / BOUQUET_ASPECT
  const framePadding = 20
  const frameHeight = bouquetImageHeight + framePadding * 2 + 52
  const noteHeight = hasNote ? measureNoteCardHeight(measureContext, bouquet) : 0
  const exportHeight =
    PADDING_TOP +
    frameHeight +
    (hasNote ? SECTION_GAP + noteHeight : 0) +
    PADDING_BOTTOM

  const canvas = document.createElement('canvas')
  canvas.width = EXPORT_WIDTH * EXPORT_SCALE
  canvas.height = exportHeight * EXPORT_SCALE

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Canvas is not available')
  }

  context.scale(EXPORT_SCALE, EXPORT_SCALE)
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'

  context.fillStyle = BACKGROUND
  context.fillRect(0, 0, EXPORT_WIDTH, exportHeight)

  const frameWidth = BOUQUET_WIDTH + framePadding * 2
  const frameX = (EXPORT_WIDTH - frameWidth) / 2
  let cursorY = PADDING_TOP

  context.save()
  context.shadowColor = 'rgba(42, 36, 32, 0.18)'
  context.shadowBlur = 36
  context.shadowOffsetY = 18
  context.fillStyle = '#ffffff'
  drawRoundedRect(context, frameX, cursorY, frameWidth, frameHeight, FRAME_RADIUS + 8)
  context.fill()
  context.restore()

  const imageX = frameX + framePadding
  const imageY = cursorY + framePadding
  context.save()
  drawRoundedRect(context, imageX, imageY, BOUQUET_WIDTH, bouquetImageHeight, FRAME_RADIUS)
  context.clip()
  drawImageCover(context, bouquetImage, imageX, imageY, BOUQUET_WIDTH, bouquetImageHeight)
  context.restore()

  context.fillStyle = '#2a2420'
  context.font = '500 34px Fraunces, Georgia, serif'
  context.textAlign = 'center'
  context.fillText(
    bouquetMeta.name,
    EXPORT_WIDTH / 2,
    imageY + bouquetImageHeight + 42,
  )

  cursorY += frameHeight

  if (hasNote) {
    cursorY += SECTION_GAP
    const cardX = (EXPORT_WIDTH - CARD_WIDTH) / 2
    const cardHeight = measureNoteCardHeight(context, bouquet)

    context.save()
    context.shadowColor = 'rgba(42, 36, 32, 0.1)'
    context.shadowBlur = 24
    context.shadowOffsetY = 10
    fillCardSurface(context, bouquet.cardStyle, cardX, cursorY, CARD_WIDTH, cardHeight, CARD_RADIUS)
    context.restore()

    const border = getNoteBorderStyle(bouquet.noteBorder)
    if (border.borderWidth > 0) {
      context.save()
      context.strokeStyle = border.borderColor
      context.lineWidth = border.borderWidth * 2
      if (border.borderStyle === 'dashed') {
        context.setLineDash([12, 8])
      } else if (border.borderStyle === 'dotted') {
        context.setLineDash([4, 6])
      }
      drawRoundedRect(context, cardX, cursorY, CARD_WIDTH, cardHeight, CARD_RADIUS)
      context.stroke()
      context.restore()
    }

    const textX = cardX + CARD_PADDING
    const innerWidth = CARD_WIDTH - CARD_PADDING * 2
    let textY = cursorY + CARD_PADDING + 8

    context.textAlign = 'left'
    context.fillStyle = surface.text
    context.font = `600 42px Fraunces, Georgia, serif`
    const toLine = bouquet.to.trim() ? `To: ${bouquet.to.trim()}` : 'To: You'
    context.fillText(toLine, textX, textY + 36)
    textY += 72

    const message = stripMessageHtml(bouquet.message).trim()
    if (message) {
      const fontSize = MESSAGE_FONT_SIZES[bouquet.messageFormat?.fontSize ?? 'base']
      context.font = getMessageFont(bouquet.messageFormat)
      context.fillStyle = getMessageColor(bouquet.messageFormat, surface.text)
      const lines = wrapText(context, message, innerWidth)
      const lineHeight = fontSize * 1.45

      for (const line of lines) {
        context.fillText(line, textX, textY + fontSize)
        textY += lineHeight
      }

      textY += 16
    }

    context.font = `600 36px ${MESSAGE_FONT_FAMILIES.inter}, sans-serif`
    context.fillStyle = surface.text
    const fromLine = bouquet.from.trim()
      ? `With love, ${bouquet.from.trim()}`
      : 'With love'
    context.textAlign = 'right'
    context.fillText(fromLine, cardX + CARD_WIDTH - CARD_PADDING, cursorY + cardHeight - CARD_PADDING)
  }

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), 'image/png', 1)
  })

  if (!blob) {
    throw new Error('Could not encode image')
  }

  return blob
}
