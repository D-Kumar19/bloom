import { encodeBouquet } from '@/lib/sharing'
import type { BouquetState } from '@/lib/types'

const SESSION_KEY = 'bloom-counted-fingerprints'

function readCountedFingerprints(): Set<string> {
  if (typeof sessionStorage === 'undefined') {
    return new Set()
  }

  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) {
      return new Set()
    }

    const parsed = JSON.parse(raw) as string[]
    return new Set(parsed)
  } catch {
    return new Set()
  }
}

function writeCountedFingerprints(fingerprints: Set<string>): void {
  if (typeof sessionStorage === 'undefined') {
    return
  }

  sessionStorage.setItem(SESSION_KEY, JSON.stringify([...fingerprints]))
}

export function bouquetCountFingerprint(state: BouquetState): string {
  return encodeBouquet(state)
}

/** Records one bouquet in the all-time counter when the user shares a link. */
export async function recordBouquetSentOnce(state: BouquetState): Promise<void> {
  const fingerprint = bouquetCountFingerprint(state)
  const counted = readCountedFingerprints()

  if (counted.has(fingerprint)) {
    return
  }

  const response = await fetch('/api/count', { method: 'POST' }).catch(() => undefined)
  if (!response?.ok) {
    return
  }

  counted.add(fingerprint)
  writeCountedFingerprints(counted)
}
