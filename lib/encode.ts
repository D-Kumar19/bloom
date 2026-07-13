import LZString from 'lz-string'

import { MIN_FLOWERS } from './types'
import type { BouquetState } from './types'

export function encodeBouquet(state: BouquetState): string {
  const json = JSON.stringify(state)
  return LZString.compressToEncodedURIComponent(json)
}

function isValidBouquetState(value: unknown): value is BouquetState {
  if (!value || typeof value !== 'object') {
    return false
  }

  const state = value as BouquetState

  return (
    Array.isArray(state.flowers) &&
    state.flowers.length >= MIN_FLOWERS &&
    typeof state.greenery === 'string' &&
    typeof state.cardStyle === 'string' &&
    (state.photoCardImage === undefined || typeof state.photoCardImage === 'string') &&
    (state.photoNoteStyle === undefined || typeof state.photoNoteStyle === 'string') &&
    (state.messageFormat === undefined ||
      (typeof state.messageFormat === 'object' &&
        state.messageFormat !== null &&
        typeof state.messageFormat.fontFamily === 'string' &&
        typeof state.messageFormat.fontSize === 'string' &&
        typeof state.messageFormat.color === 'string')) &&
    (state.noteBorder === undefined ||
      (typeof state.noteBorder === 'object' &&
        state.noteBorder !== null &&
        typeof state.noteBorder.style === 'string' &&
        typeof state.noteBorder.color === 'string')) &&
    typeof state.message === 'string' &&
    typeof state.to === 'string' &&
    typeof state.from === 'string' &&
    typeof state.theme === 'string'
  )
}

export function decodeBouquet(encoded: string): BouquetState | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded)
    if (!json) {
      return null
    }

    const parsed: unknown = JSON.parse(json)
    return isValidBouquetState(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function buildShareUrl(state: BouquetState): string {
  if (typeof window === 'undefined') {
    return ''
  }

  const encoded = encodeBouquet(state)
  return `${window.location.origin}/bouquet?b=${encoded}`
}
