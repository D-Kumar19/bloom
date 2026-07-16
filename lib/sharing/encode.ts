import LZString from 'lz-string'

import { bouquetExists } from '@/lib/bouquets'
import { getSiteOrigin } from '@/lib/siteUrl'
import type { BouquetState } from '../types'

const LEGACY_PHOTO_CARD_ID = 'photo-card'

export function encodeBouquet(state: BouquetState): string {
  const json = JSON.stringify(state)
  return LZString.compressToEncodedURIComponent(json)
}

export function isValidBouquetState(value: unknown): value is BouquetState {
  if (!value || typeof value !== 'object') {
    return false
  }

  const state = value as BouquetState

  if (state.cardStyle === LEGACY_PHOTO_CARD_ID) {
    return false
  }

  return (
    typeof state.bouquetId === 'string' &&
    bouquetExists(state.bouquetId) &&
    typeof state.cardStyle === 'string' &&
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
    state.from.trim().length > 0 &&
    typeof state.theme === 'string' &&
    (state.soundtrack === undefined || typeof state.soundtrack === 'string')
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
  const encoded = encodeBouquet(state)
  return `${getSiteOrigin()}/bouquet?b=${encoded}`
}

/** Same-origin path for in-app "preview as recipient" navigation. */
export function buildRecipientPreviewPath(state: BouquetState): string {
  const encoded = encodeBouquet(state)
  return `/bouquet?b=${encoded}&preview=1`
}

export function buildRecipientPreviewUrl(state: BouquetState): string {
  return `${buildShareUrl(state)}&preview=1`
}

export function isRecipientPreviewUrl(search: string): boolean {
  return new URLSearchParams(search).get('preview') === '1'
}
