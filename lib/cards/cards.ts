import type { BouquetState, CardStyle } from '../types'

export const FEATURED_CARD_ID = 'classic-cream'

/** Nine paper note styles. */
export const NOTE_CARD_STYLES: CardStyle[] = [
  {
    id: FEATURED_CARD_ID,
    name: 'Classic Cream',
    tagline: 'Timeless and warm.',
    featured: true,
  },
  { id: 'vintage', name: 'Vintage', tagline: 'Aged paper, old soul.' },
  { id: 'midnight', name: 'Midnight', tagline: 'Bold under the stars.' },
  { id: 'rose-gold', name: 'Rose Gold', tagline: 'For celebrations.' },
  { id: 'watercolor', name: 'Watercolor', tagline: 'Soft and dreamy.' },
  { id: 'kraft', name: 'Kraft', tagline: 'Simple and honest.' },
  { id: 'garden', name: 'Garden Party', tagline: 'Light and joyful.' },
  { id: 'blush', name: 'Blush', tagline: 'Sweet and romantic.' },
  { id: 'linen', name: 'Linen', tagline: 'Clean and calm.' },
]

/** Eight pickable styles in the grid (themes 1-8). */
export const GRID_CARD_STYLES: CardStyle[] = NOTE_CARD_STYLES.filter(
  (style) => style.id !== FEATURED_CARD_ID,
)

/** Theme 9: featured at the top. */
export const FEATURED_CARD_STYLE: CardStyle = NOTE_CARD_STYLES[0]

export const CARD_STYLES: CardStyle[] = [...NOTE_CARD_STYLES]

export const SURPRISE_CARD_IDS = NOTE_CARD_STYLES.map((style) => style.id)

export const CARD_STYLE_MAP = new Map(CARD_STYLES.map((c) => [c.id, c]))

export function getCardStyleById(id: string): CardStyle | undefined {
  return CARD_STYLE_MAP.get(id)
}

export function getEffectiveNoteStyleId(state: Pick<BouquetState, 'cardStyle'>): string {
  return state.cardStyle
}

export function getDisplayCardLabel(state: Pick<BouquetState, 'cardStyle'>): string {
  return getCardStyleById(state.cardStyle)?.name ?? 'Classic Cream'
}
