import { describe, expect, it } from 'vitest'

import {
  getAnimatedThemeNames,
  getThemeById,
  isThemeAnimated,
  THEMES,
} from '@/lib/themes'

describe('isThemeAnimated', () => {
  it('marks still backdrops as not animated', () => {
    for (const id of ['warm', 'blush', 'lavender', 'overcast', 'frost']) {
      const theme = getThemeById(id)
      expect(theme, id).toBeDefined()
      expect(isThemeAnimated(theme!)).toBe(false)
    }
  })

  it('marks motion and particle backdrops as animated', () => {
    for (const id of ['sage', 'sunset', 'ocean', 'cherry', 'candlelight', 'midnight']) {
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
    expect(names).not.toContain('Morning Light')
  })
})
