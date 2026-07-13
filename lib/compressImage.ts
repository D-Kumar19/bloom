const MAX_EDGE = 1024
const INITIAL_JPEG_QUALITY = 0.9
const MIN_JPEG_QUALITY = 0.78
const TARGET_MAX_BYTES = 280_000
export const PHOTO_WARN_BYTES = 2 * 1024 * 1024

export type CompressedImage = {
  dataUrl: string
  warning?: string
}

type DecodedImage = {
  source: CanvasImageSource
  width: number
  height: number
  dispose: () => void
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read that image.'))
    }
    image.src = url
  })
}

async function decodeImageFile(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap !== 'undefined') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        dispose: () => bitmap.close(),
      }
    } catch {
      // Fall back to Image() when createImageBitmap rejects the file type.
    }
  }

  const image = await loadImageFromFile(file)
  return {
    source: image,
    width: image.naturalWidth || image.width,
    height: image.naturalHeight || image.height,
    dispose: () => {},
  }
}

function fitWithinEdge(width: number, height: number, maxEdge: number): { width: number; height: number } {
  const longest = Math.max(width, height)
  if (longest <= maxEdge) {
    return { width, height }
  }

  const scale = maxEdge / longest
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  }
}

function estimateDataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] ?? ''
  return Math.floor((base64.length * 3) / 4)
}

function renderJpeg(
  source: CanvasImageSource,
  width: number,
  height: number,
  quality: number,
): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Could not process that image.')
  }

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.drawImage(source, 0, 0, width, height)

  return canvas.toDataURL('image/jpeg', quality)
}

/** Resize and compress an upload for photo-card share URLs while keeping detail sharp. */
export async function compressImageFile(file: File): Promise<CompressedImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.')
  }

  const warning =
    file.size > PHOTO_WARN_BYTES
      ? 'Large photo — we tuned it so your share link stays reliable.'
      : undefined

  const decoded = await decodeImageFile(file)

  try {
    const { width, height } = fitWithinEdge(decoded.width, decoded.height, MAX_EDGE)
    let quality = INITIAL_JPEG_QUALITY
    let dataUrl = renderJpeg(decoded.source, width, height, quality)

    while (estimateDataUrlBytes(dataUrl) > TARGET_MAX_BYTES && quality > MIN_JPEG_QUALITY) {
      quality = Math.max(MIN_JPEG_QUALITY, quality - 0.04)
      dataUrl = renderJpeg(decoded.source, width, height, quality)
    }

    return { dataUrl, warning }
  } finally {
    decoded.dispose()
  }
}
