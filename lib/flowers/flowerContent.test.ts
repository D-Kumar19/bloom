import { describe, expect, it } from 'vitest'

import { FLOWERS } from '@/lib/flowers'
import { FLOWER_CONTENT, getFlowerContent } from '@/lib/flowers/flowerContent'

describe('flowerContent', () => {
  it('has detail content for every catalog flower', () => {
    for (const flower of FLOWERS) {
      const content = getFlowerContent(flower.id)
      expect(content, `missing content for ${flower.id}`).toBeDefined()
      expect(content?.story.length).toBeGreaterThan(0)
      expect(content?.whenToSend.length).toBeGreaterThan(0)
      expect(content?.whenNotToSend.length).toBeGreaterThan(0)
      expect(content?.related.length).toBeGreaterThan(0)
    }
  })

  it('returns undefined for unknown flower ids', () => {
    expect(getFlowerContent('not-a-flower')).toBeUndefined()
  })

  it('covers exactly the catalog flowers', () => {
    expect(Object.keys(FLOWER_CONTENT).sort()).toEqual(
      FLOWERS.map((flower) => flower.id).sort(),
    )
  })
})
