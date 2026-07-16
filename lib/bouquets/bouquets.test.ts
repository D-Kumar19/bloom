import { describe, expect, it } from 'vitest'

import {
  BOUQUET_MOODS,
  BOUQUETS,
  bouquetExists,
  getBouquetsByMood,
} from '@/lib/bouquets'

describe('bouquets catalog', () => {
  it('defines 15 bouquets with thumb and hero image paths', () => {
    expect(BOUQUETS).toHaveLength(15)
    for (const bouquet of BOUQUETS) {
      expect(bouquet.thumbnailImage).toMatch(/^\/bouquets\/.*-thumb\.png$/)
      expect(bouquet.heroImage).toMatch(/^\/bouquets\/.*-hero\.png$/)
      expect(bouquetExists(bouquet.id)).toBe(true)
    }
  })

  it('assigns every bouquet to a known mood tab', () => {
    const moodIds = new Set(BOUQUET_MOODS.map((mood) => mood.id))
    for (const bouquet of BOUQUETS) {
      expect(moodIds.has(bouquet.mood)).toBe(true)
    }
  })

  it('distributes bouquets across mood tabs', () => {
    for (const mood of BOUQUET_MOODS) {
      expect(getBouquetsByMood(mood.id).length).toBeGreaterThan(0)
    }
  })
})
