import { describe, expect, it } from 'vitest'

import { getRevealTextTone } from '@/lib/bouquet/revealTone'
import { THEMES } from '@/lib/themes'

describe('getRevealTextTone', () => {
  it('uses fixed dark ink on light backdrops so app dark mode cannot wash text out', () => {
    const lightThemes = THEMES.filter((theme) => !theme.dark)

    for (const theme of lightThemes) {
      const tone = getRevealTextTone(theme.id)

      expect(tone.dark).toBe(false)
      expect(tone.title).toContain('#2a2420')
      expect(tone.title).not.toContain('bloom-ink')
      expect(tone.ghostButton).toContain('#2a2420')
      expect(tone.iconButton).toContain('#2a2420')
    }
  })

  it('uses light ink on dark backdrops', () => {
    const darkThemes = THEMES.filter((theme) => theme.dark)

    for (const theme of darkThemes) {
      const tone = getRevealTextTone(theme.id)

      expect(tone.dark).toBe(true)
      expect(tone.title).toBe('text-white')
      expect(tone.ghostButton).toContain('white')
    }
  })
})
