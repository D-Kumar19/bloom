import { describe, expect, it } from 'vitest'

import {
  ANIMATED_THEME_IDS,
  getAnimatedThemeNames,
  getThemeById,
  isThemeAnimated,
  THEMES,
} from '@/lib/themes'

describe('isThemeAnimated', () => {
  it('marks still backdrops as not animated', () => {
    for (const id of ['warm', 'blush', 'lavender', 'overcast', 'frost', 'ocean']) {
      const theme = getThemeById(id)
      expect(theme, id).toBeDefined()
      expect(isThemeAnimated(theme!)).toBe(false)
    }
  })

  it('marks only the five curated animated backdrops', () => {
    expect(ANIMATED_THEME_IDS).toEqual(['candlelight', 'midnight', 'cherry', 'sage', 'sunset'])
    for (const id of ANIMATED_THEME_IDS) {
      const theme = getThemeById(id)
      expect(theme, id).toBeDefined()
      expect(isThemeAnimated(theme!)).toBe(true)
    }
  })

  it('lists animated theme names for the picker copy', () => {
    const names = getAnimatedThemeNames()
    expect(names).toEqual(
      THEMES.filter(isThemeAnimated).map((theme) => theme.name),
    )
    expect(names).toContain('Spring Meadow')
    expect(names).toContain('Golden Hour')
    expect(names).not.toContain('Morning Light')
    expect(names).not.toContain('Ocean Breeze')
  })
})
