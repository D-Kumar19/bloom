import { beforeEach, describe, expect, it, vi } from 'vitest'

const { html2canvasMock, toBlobMock } = vi.hoisted(() => ({
  html2canvasMock: vi.fn(),
  toBlobMock: vi.fn(),
}))

vi.mock('html2canvas', () => ({
  default: html2canvasMock,
}))

import { captureElementImage } from '@/lib/export/captureElementImage'

describe('captureElementImage', () => {
  beforeEach(() => {
    html2canvasMock.mockReset()
    toBlobMock.mockReset()

    html2canvasMock.mockResolvedValue({
      width: 400,
      height: 600,
      toBlob: toBlobMock,
    })

    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready: Promise.resolve() },
    })

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

    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        callback(0)
        return 1
      },
    })
  })

  it('inlines images, moves the snapshot into view, and captures a png blob', async () => {
    const element = document.createElement('div')
    element.style.position = 'fixed'
    element.style.left = '-9999px'
    element.style.width = '448px'
    element.style.height = '600px'
    element.innerHTML =
      '<img src="/bouquets/red-rose-classic-hero.png" alt="Red Rose Classic" />'
    document.body.appendChild(element)

    Object.defineProperty(element, 'offsetWidth', { configurable: true, value: 448 })
    Object.defineProperty(element, 'offsetHeight', { configurable: true, value: 600 })

    const blob = new Blob(['png'], { type: 'image/png' })
    toBlobMock.mockImplementation((callback: (result: Blob | null) => void) => {
      callback(blob)
    })

    const result = await captureElementImage(element)

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/bouquets/red-rose-classic-hero.png')
    expect(element.style.left).toBe('-9999px')
    expect(result).toBe(blob)
    expect(html2canvasMock).toHaveBeenCalledWith(
      element,
      expect.objectContaining({
        backgroundColor: '#fff8f0',
        useCORS: false,
        allowTaint: false,
      }),
    )

    element.remove()
  })
})
