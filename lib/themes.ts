import type { Theme } from './types'

export {
  getThemeDecorationDescription,
  getThemeDecorations,
  type ThemeDecoration,
} from './themes/decorations'

const DEFAULT_EFFECTS = ['grain', 'vignette'] as const

export const THEMES: Theme[] = [
  {
    id: 'warm',
    name: 'Morning Light',
    tagline: 'Morning light through curtains',
    className: 'bg-gradient-to-b from-[#FDF8F5] to-[#F5EDE6]',
    description:
      'Soft cream and honey tones, like the first quiet hour of the day. Nothing loud, just warmth settling in.',
    mood: 'Gentle, hopeful, unhurried',
    perfectFor: 'Everyday love notes, thank-yous, and "just because" bouquets',
    lightPosition: 'top-left',
    lightTint: 'rgb(255 248 240 / 0.7)',
    accentTint: 'rgb(245 220 190 / 0.25)',
    accentAt: 'bottom-right',
    effects: [...DEFAULT_EFFECTS],
    motion: 'none',
  },
  {
    id: 'blush',
    name: 'Soft Blush',
    tagline: 'The color of a compliment you almost said out loud',
    className: 'bg-gradient-to-b from-[#FFF5F0] to-[#F5D8CE]',
    description:
      'Peach-rose warmth for steady affection, not drama. The kind of light you want when you mean it without making a scene.',
    mood: 'Tender, romantic, quietly sure',
    perfectFor: 'Crushes, anniversaries, and messages you rewrote twice',
    lightPosition: 'top',
    lightTint: 'rgb(255 235 228 / 0.65)',
    accentTint: 'rgb(232 165 165 / 0.22)',
    accentAt: 'center',
    effects: [...DEFAULT_EFFECTS],
    motion: 'none',
  },
  {
    id: 'sage',
    name: 'Spring Meadow',
    tagline: 'The feeling of a fresh start',
    className: 'bg-gradient-to-b from-[#F2F7F0] to-[#DDE8D8]',
    description:
      'Cool green air and open sky. Leaves and birds drift gently while pollen motes float through the meadow light.',
    mood: 'Fresh, calm, quietly optimistic',
    perfectFor: 'New chapters, encouragement, and "you\'ve got this" bouquets',
    lightPosition: 'top',
    lightTint: 'rgb(255 255 250 / 0.55)',
    accentTint: 'rgb(138 159 126 / 0.18)',
    accentAt: 'bottom-left',
    effects: [...DEFAULT_EFFECTS, 'pollen'],
    motion: 'pollen-float',
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    tagline: 'Falling asleep thinking of you',
    className: 'bg-gradient-to-b from-[#F5F0FA] to-[#E4DAF0]',
    description:
      'Muted purple haze that slows the world down. Intimate without urgency, like a whisper at the end of the day.',
    mood: 'Dreamy, reflective, soft-focus',
    perfectFor: 'Late-night messages, missing someone, long-distance love',
    lightPosition: 'center',
    lightTint: 'rgb(240 230 250 / 0.45)',
    accentTint: 'rgb(184 169 200 / 0.2)',
    accentAt: 'top-right',
    effects: [...DEFAULT_EFFECTS],
    motion: 'none',
  },
  {
    id: 'sunset',
    name: 'Golden Hour',
    tagline: 'That perfect moment before sunset',
    className: 'bg-gradient-to-b from-[#FFF8EE] to-[#F5DFC4]',
    description:
      'Warm amber light that makes everything feel a little more precious. Hearts and birds drift slowly across the glow.',
    mood: 'Nostalgic, glowing, bittersweet in a good way',
    perfectFor: 'Milestones, gratitude, and "remember when we..." notes',
    lightPosition: 'top',
    lightTint: 'rgb(255 220 170 / 0.55)',
    accentTint: 'rgb(201 166 107 / 0.28)',
    accentAt: 'bottom-left',
    effects: [...DEFAULT_EFFECTS],
    motion: 'glow-drift',
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    tagline: 'Calm. Like you.',
    className: 'bg-gradient-to-b from-[#E8F4F8] to-[#B8D4E3]',
    description:
      'Cool blue air that steadies the heart. Soft clouds and distant birds rest around a wide, quiet horizon.',
    mood: 'Peaceful, steady, reassuring',
    perfectFor: 'Comfort, sympathy, and "I\'m here" without saying much',
    lightPosition: 'bottom',
    lightTint: 'rgb(200 230 245 / 0.5)',
    accentTint: 'rgb(140 190 220 / 0.22)',
    accentAt: 'bottom-right',
    effects: [...DEFAULT_EFFECTS],
    motion: 'wave-shift',
  },
  {
    id: 'overcast',
    name: 'Overcast',
    tagline: 'Soft grey light on a still day',
    className: 'bg-gradient-to-b from-[#E8E6ED] to-[#C8C4D0]',
    description:
      'Flat, cool lavender-grey. No drama, just room to breathe. Good when comfort matters more than cheer.',
    mood: 'Gentle, steady, quietly present',
    perfectFor: 'Sympathy, checking in, and holding space without fixing',
    lightPosition: 'top',
    lightTint: 'rgb(255 255 255 / 0.35)',
    accentTint: 'rgb(160 155 175 / 0.2)',
    accentAt: 'center',
    effects: [...DEFAULT_EFFECTS],
    motion: 'none',
  },
  {
    id: 'frost',
    name: 'First Frost',
    tagline: 'Winter air, silver at the edges',
    className: 'bg-gradient-to-b from-[#F4F8FC] to-[#D8E4EE]',
    description:
      'Pale blue-white with a hint of silver. Crisp and clean, like the first cold morning of the year.',
    mood: 'Clear, hopeful, quietly new',
    perfectFor: 'New year notes, fresh starts, and winter birthdays',
    lightPosition: 'top-left',
    lightTint: 'rgb(255 255 255 / 0.65)',
    accentTint: 'rgb(180 200 220 / 0.25)',
    accentAt: 'bottom-right',
    effects: [...DEFAULT_EFFECTS],
    motion: 'none',
  },
  {
    id: 'cherry',
    name: 'Cherry Blossom',
    tagline: "Beautiful because it doesn't last forever",
    className: 'bg-gradient-to-b from-[#FFF5FA] to-[#F0C4D4]',
    description:
      'Cool pink with drifting petals and floating hearts. Fleeting on purpose, because some feelings are too lovely to hoard.',
    mood: 'Poetic, fleeting, quietly joyful',
    perfectFor: 'Farewells, spring birthdays, and love you want to savor',
    lightPosition: 'top-left',
    lightTint: 'rgb(255 240 248 / 0.6)',
    accentTint: 'rgb(232 165 185 / 0.3)',
    accentAt: 'bottom-left',
    effects: [...DEFAULT_EFFECTS, 'petals'],
    motion: 'none',
    animated: true,
  },
  {
    id: 'candlelight',
    name: 'Candlelight',
    tagline: 'Close enough to feel the warmth',
    className: 'bg-gradient-to-b from-[#2A2218] to-[#1A1510]',
    description:
      'A single warm glow at the center with a flickering flame, soft glowworms, and sparks that breathe in and out like wind through a room.',
    mood: 'Cozy, close, unhurried',
    perfectFor: 'Anniversaries at home, apologies, and "I needed you to know"',
    lightPosition: 'center',
    lightTint: 'rgb(255 200 140 / 0.35)',
    accentTint: 'rgb(220 160 90 / 0.2)',
    accentAt: 'center',
    effects: [...DEFAULT_EFFECTS],
    motion: 'glow-drift',
    dark: true,
    animated: true,
  },
  {
    id: 'midnight',
    name: 'Midnight Garden',
    tagline: 'A secret told under stars',
    className: 'bg-gradient-to-b from-[#1A1A2E] to-[#2D2D44]',
    description:
      'Deep indigo stillness with twinkling stars, drifting clouds, and sparkles that feel like secrets in the dark.',
    mood: 'Mysterious, intimate, hushed',
    perfectFor: 'Confessions, apologies, and messages meant for one person only',
    lightPosition: 'top-left',
    lightTint: 'rgb(120 110 160 / 0.15)',
    accentTint: 'rgb(80 70 120 / 0.25)',
    accentAt: 'center',
    effects: [...DEFAULT_EFFECTS, 'stars'],
    motion: 'twinkle',
    dark: true,
    animated: true,
  },
]

export const THEME_MAP = new Map(THEMES.map((t) => [t.id, t]))

export function getThemeById(id: string): Theme | undefined {
  return THEME_MAP.get(id)
}

export const ANIMATED_THEME_IDS = [
  'candlelight',
  'midnight',
  'cherry',
  'sage',
  'sunset',
] as const

export type AnimatedThemeId = (typeof ANIMATED_THEME_IDS)[number]

export function isAnimatedThemeId(id: string): id is AnimatedThemeId {
  return (ANIMATED_THEME_IDS as readonly string[]).includes(id)
}

export function isThemeAnimated(theme: Theme): boolean {
  return isAnimatedThemeId(theme.id)
}

export function getAnimatedThemeNames(): string[] {
  return THEMES.filter(isThemeAnimated).map((theme) => theme.name)
}

export function getMotionLabel(motion: Theme['motion']): string | null {
  switch (motion) {
    case 'breathe':
      return 'Slow brightness breathe'
    case 'glow-drift':
      return 'Warm glow drifting across the frame'
    case 'wave-shift':
      return 'Gentle gradient shift, like slow waves'
    case 'blur-pulse':
      return 'Soft dreamy blur pulse'
    case 'twinkle':
      return 'Sparse twinkling stars'
    case 'pollen-float':
      return 'Occasional floating pollen motes'
    case 'none':
    case undefined:
      return null
    default:
      return null
  }
}

export function getThemeMotionDescription(theme: Theme): string | null {
  if (!isThemeAnimated(theme)) {
    return null
  }

  if (theme.id === 'candlelight') {
    return 'Flickering candle glow with drifting glowworms and soft sparks.'
  }
  if (theme.effects?.includes('petals')) {
    return 'Drifting cherry petals on the reveal.'
  }
  const label = getMotionLabel(theme.motion)
  if (label) {
    return label
  }
  if (theme.animated) {
    return 'Gentle animation on the reveal.'
  }
  return null
}
