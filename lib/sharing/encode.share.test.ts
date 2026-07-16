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
  })

  it('uses NEXT_PUBLIC_SITE_URL instead of localhost', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://bloom.app')

    const url = buildShareUrl(sampleState)

    expect(url.startsWith('https://bloom.app/bouquet?b=')).toBe(true)
    expect(url).not.toContain('localhost')
  })
})
