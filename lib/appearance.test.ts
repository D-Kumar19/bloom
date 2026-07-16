import { describe, expect, it } from 'vitest'

import { isAppearanceMode, resolveDarkMode } from '@/lib/appearance'

describe('appearance', () => {
  it('validates appearance modes', () => {
    expect(isAppearanceMode('light')).toBe(true)
    expect(isAppearanceMode('dark')).toBe(true)
    expect(isAppearanceMode('system')).toBe(true)
    expect(isAppearanceMode('warm')).toBe(false)
  })

  it('resolves explicit light and dark modes', () => {
    expect(resolveDarkMode('light')).toBe(false)
    expect(resolveDarkMode('dark')).toBe(true)
  })
})
