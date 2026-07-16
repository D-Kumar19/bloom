import { describe, expect, it } from 'vitest'

import { formatWordsLeft } from '@/lib/message'

describe('formatWordsLeft', () => {
  it('uses warmer copy when there is plenty of room', () => {
    expect(formatWordsLeft(200)).toBe('200 words of love left')
    expect(formatWordsLeft(21)).toBe('21 words of love left')
  })

  it('shortens copy near the limit', () => {
    expect(formatWordsLeft(10)).toBe('10 words left')
    expect(formatWordsLeft(1)).toBe('1 word left')
  })
})
