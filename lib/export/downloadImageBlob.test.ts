import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { downloadImageBlob } from '@/lib/export/downloadImageBlob'

describe('downloadImageBlob', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('open', vi.fn())
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:mock-url'),
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('downloads via a temporary anchor on desktop', async () => {
    const click = vi.fn()
    const remove = vi.fn()
    const appendChild = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
      Object.assign(node as HTMLAnchorElement, { click, remove })
      return node
    })

    const blob = new Blob(['png'], { type: 'image/png' })
    await downloadImageBlob(blob, 'bloom-bouquet.png')

    expect(URL.createObjectURL).toHaveBeenCalledWith(blob)
    expect(click).toHaveBeenCalled()
    expect(remove).toHaveBeenCalled()
    expect(URL.revokeObjectURL).not.toHaveBeenCalled()

    vi.advanceTimersByTime(60_000)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')

    appendChild.mockRestore()
  })
})
