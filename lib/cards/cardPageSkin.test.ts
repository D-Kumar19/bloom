import { describe, expect, it } from 'vitest'

import {
  getCardPageSkinClass,
  getMessageStepSkinId,
} from '@/lib/cards/cardPageSkin'

describe('cardPageSkin', () => {
  it('maps note styles to skin classes', () => {
    expect(getCardPageSkinClass('classic-cream')).toBe('card-skin-classic-cream')
    expect(getCardPageSkinClass('midnight')).toBe('card-skin-midnight')
    expect(getCardPageSkinClass('garden')).toBe('card-skin-garden')
  })

  it('uses the selected card style for message step skin', () => {
    expect(getMessageStepSkinId('midnight')).toBe('midnight')
    expect(getMessageStepSkinId('garden')).toBe('garden')
    expect(getMessageStepSkinId('unknown-style')).toBe('classic-cream')
  })
})
