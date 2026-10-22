import { describe, expect, it } from 'vitest'

import { decodeBouquet, encodeBouquet } from '@/lib/sharing'
import type { BouquetState } from '@/lib/types'

const sampleState: BouquetState = {
  bouquetId: 'red-rose-classic',
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

  it('round-trips a stable gift ID while preserving legacy links without one', () => {
    const withId = { ...sampleState, giftId: '12345678-1234-4234-8234-123456789012' }
    expect(decodeBouquet(encodeBouquet(withId))).toEqual(withId)
    expect(decodeBouquet(encodeBouquet(sampleState))?.giftId).toBeUndefined()
  })

  it('rejects an invalid supplied gift ID', () => {
    expect(decodeBouquet(encodeBouquet({ ...sampleState, giftId: 'not-a-uuid' }))).toBeNull()
  })
  it('returns null for corrupted hash without throwing', () => {
    expect(() => decodeBouquet('not-a-valid-hash')).not.toThrow()
    expect(decodeBouquet('not-a-valid-hash')).toBeNull()
  })

  it('returns null when bouquetId is unknown', () => {
    const invalid: BouquetState = { ...sampleState, bouquetId: 'not-a-real-bouquet' }
    expect(decodeBouquet(encodeBouquet(invalid))).toBeNull()
  })

  it('survives max word message round-trip', () => {
    const long: BouquetState = {
      ...sampleState,
      message: Array(200).fill('word').join(' '),
    }
    expect(decodeBouquet(encodeBouquet(long))).toEqual(long)
  })

  it('rejects legacy photo-card payloads on decode', () => {
    const withPhoto = {
      ...sampleState,
      cardStyle: 'photo-card',
    } as BouquetState

    expect(decodeBouquet(encodeBouquet(withPhoto))).toBeNull()
  })

  it('returns null when sender name is missing', () => {
    const anonymous: BouquetState = { ...sampleState, from: '   ' }
    expect(decodeBouquet(encodeBouquet(anonymous))).toBeNull()
  })

  it('round-trips note border customization', () => {
    const withBorder: BouquetState = {
      ...sampleState,
      noteBorder: { style: 'dashed', color: '#c45c5c' },
    }
    expect(decodeBouquet(encodeBouquet(withBorder))).toEqual(withBorder)
  })
})
