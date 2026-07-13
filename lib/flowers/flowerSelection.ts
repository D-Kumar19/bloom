import type { BouquetState } from '../types'
import { MAX_FLOWERS } from '../types'

/** Count how many times each flower id appears in the bouquet. */
export function countFlowersById(flowers: string[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const id of flowers) {
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }
  return counts
}

export function getFlowerQuantity(flowers: string[], flowerId: string): number {
  return flowers.filter((id) => id === flowerId).length
}

export function getTotalFlowerCount(flowers: string[]): number {
  return flowers.length
}

/** Add or remove one instance of a flower type. Respects max total when adding. */
export function adjustFlowerQuantity(
  flowers: string[],
  flowerId: string,
  delta: number,
  maxTotal: number = MAX_FLOWERS
): string[] {
  if (delta === 0) {
    return flowers
  }

  if (delta > 0) {
    const room = maxTotal - flowers.length
    if (room <= 0) {
      return flowers
    }
    const toAdd = Math.min(delta, room)
    return [...flowers, ...Array.from({ length: toAdd }, () => flowerId)]
  }

  let remaining = Math.abs(delta)
  const next = [...flowers]

  for (let i = next.length - 1; i >= 0 && remaining > 0; i -= 1) {
    if (next[i] === flowerId) {
      next.splice(i, 1)
      remaining -= 1
    }
  }

  return next
}

export function summarizeFlowerSelection(flowers: string[]): string {
  const counts = countFlowersById(flowers)
  const parts = Array.from(counts.entries()).map(([id, qty]) => {
    const label = id.charAt(0).toUpperCase() + id.slice(1)
    return qty === 1 ? `1 ${label}` : `${qty} ${label}s`
  })
  return parts.join(', ')
}

export function pickStepCanProceed(state: Pick<BouquetState, 'flowers'>): boolean {
  return state.flowers.length >= 3
}
