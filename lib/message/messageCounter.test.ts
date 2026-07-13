import { describe, expect, it } from 'vitest'

import { formatCharactersLeft } from '@/lib/message'

describe('formatCharactersLeft', () => {
  it('uses the warm copy when there is room to spare', () => {
    expect(formatCharactersLeft(200)).toBe('200 characters of love left')
    expect(formatCharactersLeft(21)).toBe('21 characters of love left')
  })

  it('drops "of love" when the limit is close', () => {
    expect(formatCharactersLeft(15)).toBe('15 characters left')
    expect(formatCharactersLeft(1)).toBe('1 character left')
  })
})
