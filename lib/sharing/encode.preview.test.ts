import { describe, expect, it } from 'vitest'

import { isRecipientPreviewUrl } from '@/lib/sharing/encode'

describe('recipient preview url', () => {
  it('detects creator preview mode from the query string', () => {
    expect(isRecipientPreviewUrl('?b=abc&preview=1')).toBe(true)
    expect(isRecipientPreviewUrl('?b=abc')).toBe(false)
  })
})
