import { isGiftId, type CountResult } from './contract'
import type { BouquetState } from '@/lib/types'

const STORAGE_KEY = 'bloom-counted-gift-ids'
const MAX_REMEMBERED = 500
const countedInMemory = new Set<string>()
const inFlight = new Map<string, Promise<void>>()
let limitedUntil = 0

function readCountedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.every(isGiftId)) {
      throw new Error('Invalid counted gift IDs')
    }
    return parsed.slice(-MAX_REMEMBERED)
  } catch {
    console.warn('Bouquet counter local storage could not be read.')
    return []
  }
}

function isCountResponse(
  value: unknown
): value is Exclude<CountResult, { status: 'limited' }> {
  return Boolean(
    value &&
    typeof value === 'object' &&
    'status' in value &&
    (value.status === 'counted' || value.status === 'duplicate') &&
    'count' in value &&
    typeof value.count === 'number' &&
    Number.isSafeInteger(value.count) &&
    value.count >= 0
  )
}

/** Records the first successful copy for a draft, not confirmed delivery. */
export function recordBouquetSentOnce(state: BouquetState): Promise<void> {
  const id = state.giftId
  if (!isGiftId(id)) {
    console.error(
      'Bouquet counter requires a stable gift ID; sharing is unaffected.'
    )
    return Promise.resolve()
  }
  if (
    countedInMemory.has(id) ||
    readCountedIds().includes(id) ||
    Date.now() < limitedUntil
  ) {
    return Promise.resolve()
  }
  const pending = inFlight.get(id)
  if (pending) return pending

  // Defer execution so even a synchronous fetch error cannot leave a stale entry.
  const recording = Promise.resolve()
    .then(async () => {
      try {
        const response = await fetch('/api/count', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ giftId: id }),
          keepalive: true,
          signal: AbortSignal.timeout(4000),
        })
        if (response.status === 429) {
          const seconds = Number(response.headers.get('Retry-After'))
          if (!Number.isInteger(seconds) || seconds < 1 || seconds > 3600) {
            throw new Error('Invalid counter rate-limit response')
          }
          limitedUntil = Date.now() + seconds * 1000
          console.warn(
            'Bouquet counter is rate limited; sharing is unaffected.'
          )
          return
        }
        if (!response.ok || !isCountResponse(await response.json())) {
          throw new Error('Counter could not confirm recording')
        }
        countedInMemory.add(id)
        if (countedInMemory.size > MAX_REMEMBERED) {
          const oldest = countedInMemory.values().next().value
          if (oldest) countedInMemory.delete(oldest)
        }
        try {
          const ids = [...new Set([...readCountedIds(), id])].slice(
            -MAX_REMEMBERED
          )
          localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
        } catch {
          console.warn('Bouquet counter local storage could not be saved.')
        }
      } catch {
        console.error(
          'Bouquet count could not be recorded; the copied gift link is unaffected.'
        )
      }
    })
    .finally(() => inFlight.delete(id))
  inFlight.set(id, recording)
  return recording
}
