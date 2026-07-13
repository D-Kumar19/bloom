import { buildShareUrl } from './encode'
import type { BouquetState } from './types'

export function buildShareMessage(state: BouquetState): string {
  const url = buildShareUrl(state)
  return `I made something for you.\nOpen this when you need a smile:\n${url}`
}

export function buildSiteShareMessage(origin: string): string {
  return `I found this beautiful thing. You can send someone digital flowers with a personal note. Thought of you.\n${origin}`
}
