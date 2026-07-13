import { describe, expect, it } from 'vitest'

import { decodeBouquet, encodeBouquet } from '@/lib/sharing'
import type { BouquetState } from '@/lib/types'

const sampleState: BouquetState = {
  flowers: ['rose', 'peony', 'tulip'],
  greenery: 'leafy',
  cardStyle: 'classic-cream',
  to: 'Sam',
  message: 'Thinking of you.',
  from: 'Alex',
  theme: 'warm',
}

describe('encodeBouquet', () => {
  it('round-trips bouquet state', () => {
    const encoded = encodeBouquet(sampleState)
    const decoded = decodeBouquet(encoded)
    expect(decoded).toEqual(sampleState)
  })

  it('returns null for corrupted hash without throwing', () => {
    expect(() => decodeBouquet('not-a-valid-hash')).not.toThrow()
    expect(decodeBouquet('not-a-valid-hash')).toBeNull()
  })

  it('returns null when fewer than 3 flowers', () => {
    const invalid: BouquetState = { ...sampleState, flowers: ['rose'] }
    expect(decodeBouquet(encodeBouquet(invalid))).toBeNull()
  })

  it('survives max length message round-trip', () => {
    const long: BouquetState = { ...sampleState, message: 'a'.repeat(200) }
    expect(decodeBouquet(encodeBouquet(long))).toEqual(long)
  })

  it('round-trips optional photo card image', () => {
    const withPhoto: BouquetState = {
      ...sampleState,
      cardStyle: 'photo-card',
      photoCardImage: 'data:image/jpeg;base64,/9j/4AAQ',
    }
    expect(decodeBouquet(encodeBouquet(withPhoto))).toEqual(withPhoto)
  })

  it('round-trips note border customization', () => {
    const withBorder: BouquetState = {
      ...sampleState,
      noteBorder: { style: 'dashed', color: '#c45c5c' },
    }
    expect(decodeBouquet(encodeBouquet(withBorder))).toEqual(withBorder)
  })
})
