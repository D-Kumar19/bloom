import { describe, expect, it } from 'vitest'

import { getBouquetRevealTitle, getBouquetTeaserLine } from '@/lib/bouquet/recipientCopy'

describe('recipientCopy', () => {
  it('uses the sender name when available', () => {
    expect(getBouquetRevealTitle('Maya')).toBe('Maya sent you a bouquet')
    expect(getBouquetTeaserLine('Maya')).toBe('Maya left this for you')
  })

  it('falls back when the sender name is missing', () => {
    expect(getBouquetRevealTitle('')).toBe('Someone sent you a bouquet')
    expect(getBouquetTeaserLine('   ')).toBe('Someone left this for you')
  })
})
