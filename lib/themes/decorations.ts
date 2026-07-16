export type ThemeDecoration = 'hearts' | 'leaves' | 'clouds' | 'sparkles' | 'birds'

const THEME_DECORATIONS: Record<string, ThemeDecoration[]> = {
  warm: [],
  blush: ['hearts'],
  lavender: [],
  sunset: ['hearts', 'birds'],
  cherry: ['hearts', 'leaves'],
  sage: ['leaves', 'birds'],
  ocean: ['clouds', 'birds'],
  frost: [],
  overcast: ['clouds', 'birds'],
  candlelight: ['sparkles', 'hearts'],
  midnight: ['sparkles', 'clouds'],
}

const DECORATION_LABELS: Record<ThemeDecoration, string> = {
  hearts: 'hearts',
  leaves: 'leaves',
  clouds: 'clouds',
  sparkles: 'sparkles',
  birds: 'birds',
}

export function getThemeDecorations(themeId: string): ThemeDecoration[] {
  return THEME_DECORATIONS[themeId] ?? []
}

export function getThemeDecorationDescription(
  themeId: string,
  options?: { animated?: boolean },
): string | null {
  const decorations = getThemeDecorations(themeId)
  if (decorations.length === 0) {
    return null
  }

  const animated = options?.animated ?? true
  const names = decorations.map((decoration) => DECORATION_LABELS[decoration])

  if (!animated) {
    if (names.length === 1) {
      return `Soft ${names[0]} rest around the frame.`
    }

    const last = names.pop()
    return `Soft ${names.join(', ')} and ${last} rest around the frame.`
  }

  if (names.length === 1) {
    return `Floating ${names[0]} drift across the reveal.`
  }

  const last = names.pop()
  return `Floating ${names.join(', ')} and ${last} drift across the reveal.`
}
