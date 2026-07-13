import type { NoteBorder, NoteBorderStyle } from '../types'

export const NOTE_BORDER_STYLE_OPTIONS: { id: NoteBorderStyle; label: string }[] = [
  { id: 'solid', label: 'Solid' },
  { id: 'dashed', label: 'Dashed' },
  { id: 'dotted', label: 'Dotted' },
  { id: 'double', label: 'Double' },
  { id: 'none', label: 'None' },
]

export const NOTE_BORDER_COLOR_OPTIONS = [
  { id: 'soft-gray', label: 'Soft gray', value: '#b0a0a0' },
  { id: 'rose', label: 'Rose', value: '#c45c5c' },
  { id: 'sage', label: 'Sage', value: '#5a7a52' },
  { id: 'gold', label: 'Gold', value: '#9a7340' },
  { id: 'ink', label: 'Ink', value: '#3d2f2f' },
  { id: 'lavender', label: 'Lavender', value: '#6b5b8a' },
  { id: 'white', label: 'White', value: '#ffffff' },
  { id: 'midnight', label: 'Midnight', value: '#1a1a2e' },
] as const

export const DEFAULT_NOTE_BORDER: NoteBorder = {
  style: 'solid',
  color: '#b0a0a0',
}

export function getNoteBorderStyle(noteBorder?: NoteBorder): {
  borderWidth: number
  borderStyle: string
  borderColor: string
} {
  const border = noteBorder ?? DEFAULT_NOTE_BORDER

  if (border.style === 'none') {
    return {
      borderWidth: 0,
      borderStyle: 'none',
      borderColor: 'transparent',
    }
  }

  return {
    borderWidth: border.style === 'double' ? 3 : 1,
    borderStyle: border.style,
    borderColor: border.color,
  }
}
