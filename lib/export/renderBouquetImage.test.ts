import { beforeEach, describe, expect, it, vi } from 'vitest'

import { computeImageCoverCrop, renderBouquetImage } from '@/lib/export/renderBouquetImage'
import type { BouquetState } from '@/lib/types'

const bouquet: BouquetState = {
  bouquetId: 'red-rose-classic',
  cardStyle: 'classic-cream',
  to: 'Sam',
  message: 'Thinking of you.',
  from: 'Alex',
  theme: 'warm',
}

function createMockContext() {
  return {
    fillStyle: '',
    strokeStyle: '',
    font: '',
    textAlign: 'left' as CanvasTextAlign,
    shadowColor: '',
    shadowBlur: 0,
    shadowOffsetY: 0,
    lineWidth: 1,
    setLineDash: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    stroke: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    closePath: vi.fn(),
    clip: vi.fn(),
    fill: vi.fn(),
    drawImage: vi.fn(),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    measureText: (text: string) => ({ width: text.length * 12 }),
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
    scale: vi.fn(),
  }
}

describe('computeImageCoverCrop', () => {
  it('crops a portrait source to a 4:5 frame without stretching', () => {
    const crop = computeImageCoverCrop(1024, 1536, 720, 900)

    expect(crop.sw / crop.sh).toBeCloseTo(720 / 900, 5)
    expect(crop.sx).toBeGreaterThanOrEqual(0)
    expect(crop.sy).toBeGreaterThan(0)
  })
})

describe('renderBouquetImage', () => {
  beforeEach(() => {
    class MockImage {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      width = 1024
      height = 1536
      naturalWidth = 1024
      naturalHeight = 1536
      set src(_value: string) {
        this.onload?.()
      }
    }

    vi.stubGlobal('Image', MockImage)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(new Blob(['png'], { type: 'image/png' })),
      }),
    )

    class FileReaderMock {
      result: string | ArrayBuffer | null = 'data:image/png;base64,ZmFrZQ=='
      onload: (() => void) | null = null
      onerror: (() => void) | null = null

      readAsDataURL() {
        this.onload?.()
      }
    }

    vi.stubGlobal('FileReader', FileReaderMock)

    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: {
        load: vi.fn().mockResolvedValue(undefined),
        ready: Promise.resolve(),
      },
    })

    const mockContext = createMockContext()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation((type) => {
      if (type === '2d') {
        return mockContext as unknown as CanvasRenderingContext2D
      }

      return null
    })

    HTMLCanvasElement.prototype.toBlob = function toBlob(
      callback: BlobCallback,
      mimeType?: string,
    ) {
      callback(new Blob(['png'], { type: mimeType ?? 'image/png' }))
    }
  })

  it('renders a png blob for a bouquet with a note', async () => {
    const blob = await renderBouquetImage(bouquet)

    expect(blob.type).toBe('image/png')
    expect(blob.size).toBeGreaterThan(0)
  })

  it('renders a png blob when there is no note', async () => {
    const blob = await renderBouquetImage({
      ...bouquet,
      message: '',
    })

    expect(blob.type).toBe('image/png')
  })
})
