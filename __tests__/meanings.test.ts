import { describe, expect, it } from 'vitest'

import { getFlowerCountMeaning } from '@/lib/meanings'

describe('getFlowerCountMeaning', () => {
  it('prompts to pick at least 3 for counts 1-2', () => {
    expect(getFlowerCountMeaning(1)).toBe(
      'Pick at least 3 flowers to complete your bouquet.'
    )
    expect(getFlowerCountMeaning(2)).toBe(
      'Pick at least 3 flowers to complete your bouquet.'
    )
  })

  it('returns universal meanings for specific counts', () => {
    expect(getFlowerCountMeaning(3)).toBe(
      'Three is a classic. It says: this was thoughtful.'
    )
    expect(getFlowerCountMeaning(12)).toBe(
      'A dozen. The classic. Unmistakable.'
    )
    expect(getFlowerCountMeaning(20)).toBe(
      'Twenty flowers. Nothing left unsaid.'
    )
  })

  it('returns range meanings for 13-19', () => {
    expect(getFlowerCountMeaning(14)).toBe(
      'A grand gesture. This bouquet has weight.'
    )
    expect(getFlowerCountMeaning(17)).toBe(
      "You're building something extraordinary."
    )
  })
})
