import { encodeBouquet } from '@/lib/sharing'
import type { BouquetState } from '@/lib/types'

const SESSION_KEY = 'bloom-counted-fingerprints'
const countedInMemory = new Set<string>()
const inFlight = new Map<string, Promise<void>>()

function readCountedFingerprints(): Set<string> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) {
      return new Set()
    }

    const parsed: unknown = JSON.parse(raw)
    if (
      !Array.isArray(parsed) ||
      !parsed.every((value) => typeof value === 'string')
    ) {
      throw new Error('Invalid counted fingerprints')
    }
    return new Set(parsed)
  } catch {
    console.warn('Bouquet counter session storage could not be read.')
    return new Set()
  }
}

function writeCountedFingerprints(fingerprints: Set<string>): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify([...fingerprints]))
  } catch {
    console.warn('Bouquet counter session storage could not be saved.')
  }
}

export function bouquetCountFingerprint(state: BouquetState): string {
  return encodeBouquet(state)
}

/** Records one bouquet in the all-time counter when the user shares a link. */
export function recordBouquetSentOnce(state: BouquetState): Promise<void> {
  const fingerprint = bouquetCountFingerprint(state)
  const counted = readCountedFingerprints()

  if (counted.has(fingerprint) || countedInMemory.has(fingerprint)) {
    return Promise.resolve()
  }
  const pending = inFlight.get(fingerprint)
  if (pending) {
    return pending
  }

  const recording = (async () => {
    try {
      const response = await fetch('/api/count', {
        method: 'POST',
        keepalive: true,
        signal: AbortSignal.timeout(4000),
      })
      if (!response.ok) {
        throw new Error(`Counter returned ${response.status}`)
      }
      countedInMemory.add(fingerprint)
      const latest = readCountedFingerprints()
      latest.add(fingerprint)
      writeCountedFingerprints(latest)
    } catch {
      console.error(
        'Bouquet count could not be recorded; the copied gift link is unaffected.'
      )
    }
  })().finally(() => {
    inFlight.delete(fingerprint)
  })
  inFlight.set(fingerprint, recording)
  return recording
}
