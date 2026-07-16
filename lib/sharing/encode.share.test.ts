import { afterEach, describe, expect, it, vi } from 'vitest'

import { buildShareUrl } from '@/lib/sharing/encode'
import type { BouquetState } from '@/lib/types'

const sampleState: BouquetState = {
  bouquetId: 'red-rose-classic',
  cardStyle: 'classic-cream',
  to: 'Sam',
  message: 'Thinking of you.',
  from: 'Alex',
  theme: 'warm',
}

describe('buildShareUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('uses localhost when the app is running locally in the browser', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://bloom.app')
    vi.stubGlobal('window', {
      location: { origin: 'http://localhost:3000' },
    } as Window & typeof globalThis)

    const url = buildShareUrl(sampleState)

    expect(url.startsWith('http://localhost:3000/bouquet?b=')).toBe(true)
  })

  it('uses NEXT_PUBLIC_SITE_URL on the server', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://bloom.app')
    const windowSpy = vi
      .spyOn(globalThis, 'window', 'get')
      .mockReturnValue(undefined as unknown as Window & typeof globalThis)

    const url = buildShareUrl(sampleState)

    expect(url.startsWith('https://bloom.app/bouquet?b=')).toBe(true)
    expect(url).not.toContain('localhost')

    windowSpy.mockRestore()
  })
})
