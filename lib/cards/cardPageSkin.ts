import { FEATURED_CARD_ID } from './cards'
import { NOTE_SURFACE_CLASSES } from './noteSurfaces'

export const CARD_PAGE_SKIN_IDS = Object.keys(NOTE_SURFACE_CLASSES)

export function getMessageStepSkinId(cardStyle: string): string {
  return cardStyle in NOTE_SURFACE_CLASSES ? cardStyle : FEATURED_CARD_ID
}

export function getCardPageSkinClass(styleId: string): string {
  const skinId = styleId in NOTE_SURFACE_CLASSES ? styleId : FEATURED_CARD_ID
  return `card-skin-${skinId}`
}
