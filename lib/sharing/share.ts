import { buildShareUrl } from './encode'
import type { BouquetState } from '../types'

export function buildShareMessage(state: BouquetState): string {
  const url = buildShareUrl(state)
  return `I made something for you.\nOpen this when you need a smile:\n${url}`
}

export const SITE_SHARE_TEXT = 'Bloom lets you send someone a digital bouquet with a personal note. No account needed.'

export function buildSiteShareMessage(origin: string): string {
  return `${SITE_SHARE_TEXT}\n${origin}`
}
