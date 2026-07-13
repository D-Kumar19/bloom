import type { Theme } from './types'

export const THEMES: Theme[] = [
  {
    id: 'warm',
    name: 'Morning Light',
    tagline: 'Morning light through curtains',
    className: 'bg-gradient-to-b from-[#FDF8F5] to-[#F5EDE6]',
  },
  {
    id: 'blush',
    name: 'Soft Blush',
    tagline: 'The color of a compliment you almost said out loud',
    className: 'bg-gradient-to-b from-[#FFF0F3] to-[#F8DDE4]',
  },
  {
    id: 'sage',
    name: 'Spring Meadow',
    tagline: 'The feeling of a fresh start',
    className: 'bg-gradient-to-b from-[#F2F7F0] to-[#DDE8D8]',
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    tagline: 'Falling asleep thinking of you',
    className: 'bg-gradient-to-b from-[#F5F0FA] to-[#E4DAF0]',
  },
  {
    id: 'sunset',
    name: 'Golden Hour',
    tagline: 'That perfect moment before sunset',
    className: 'bg-gradient-to-b from-[#FFF8EE] to-[#F5DFC4]',
  },
  {
    id: 'midnight',
    name: 'Midnight Garden',
    tagline: 'A secret told under stars',
    className: 'bg-gradient-to-b from-[#1A1A2E] to-[#2D2D44] text-white',
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    tagline: 'Calm. Like you.',
    className: 'bg-gradient-to-b from-[#E8F4F8] to-[#B8D4E3]',
  },
  {
    id: 'cherry',
    name: 'Cherry Blossom',
    tagline: "Beautiful because it doesn't last forever",
    className: 'bg-gradient-to-b from-[#FFF0F5] to-[#F8D0DC]',
    animated: true,
  },
]

export const THEME_MAP = new Map(THEMES.map((t) => [t.id, t]))

export function getThemeById(id: string): Theme | undefined {
  return THEME_MAP.get(id)
}
