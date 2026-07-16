import { describe, expect, it } from 'vitest'

import { buildRecipientPreviewPath, isRecipientPreviewUrl } from '@/lib/sharing/encode'
import { DEFAULT_BOUQUET_ID } from '@/lib/bouquets'

const baseState = {
  bouquetId: DEFAULT_BOUQUET_ID,
  cardStyle: 'classic-cream',
  to: 'Alex',
  message: 'Thinking of you',
  from: 'Sam',
  theme: 'cherry',
}

describe('recipient preview url', () => {
  it('builds a same-origin preview path', () => {
    const path = buildRecipientPreviewPath(baseState)

    expect(path.startsWith('/bouquet?b=')).toBe(true)
    expect(path.endsWith('&preview=1')).toBe(true)
    expect(path.includes('https://')).toBe(false)
  })

  it('detects creator preview mode from the query string', () => {
    expect(isRecipientPreviewUrl('?b=abc&preview=1')).toBe(true)
    expect(isRecipientPreviewUrl('?b=abc')).toBe(false)
  })
})
