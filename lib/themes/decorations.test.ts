import { describe, expect, it } from 'vitest'

import {
  getThemeDecorationDescription,
  getThemeDecorations,
} from '@/lib/themes/decorations'

describe('theme decorations', () => {
  it('keeps calm backdrops free of floating decorations', () => {
    expect(getThemeDecorations('warm')).toEqual([])
    expect(getThemeDecorations('lavender')).toEqual([])
    expect(getThemeDecorations('frost')).toEqual([])
  })

  it('maps romantic themes to hearts', () => {
    expect(getThemeDecorations('blush')).toContain('hearts')
    expect(getThemeDecorations('warm')).not.toContain('hearts')
  })

  it('maps meadow themes to leaves', () => {
    expect(getThemeDecorations('sage')).toContain('leaves')
  })

  it('maps ocean themes to clouds and birds', () => {
    expect(getThemeDecorations('ocean')).toContain('clouds')
    expect(getThemeDecorations('ocean')).toContain('birds')
  })

  it('maps dark themes to sparkles', () => {
    expect(getThemeDecorations('midnight')).toContain('sparkles')
    expect(getThemeDecorations('candlelight')).toContain('sparkles')
  })

  it('describes decorations for the theme picker', () => {
    expect(getThemeDecorationDescription('ocean')).toMatch(/clouds and birds/i)
    expect(getThemeDecorationDescription('blush')).toMatch(/hearts/i)
    expect(getThemeDecorationDescription('blush', { animated: false })).toMatch(/rest around/i)
    expect(getThemeDecorationDescription('warm')).toBeNull()
  })
})
