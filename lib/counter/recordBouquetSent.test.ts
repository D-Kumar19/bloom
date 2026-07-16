import { afterEach, describe, expect, it, vi } from 'vitest'

import { recordBouquetSentOnce } from '@/lib/counter/recordBouquetSent'
import type { BouquetState } from '@/lib/types'

const sampleState: BouquetState = {
  bouquetId: 'red-rose-classic',
  cardStyle: 'classic-cream',
  to: 'Sam',
  from: 'Alex',
  message: 'Thinking of you',
  theme: 'warm',
  soundtrack: 'none',
}

describe('recordBouquetSentOnce', () => {
  afterEach(() => {
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('posts to the counter once per bouquet fingerprint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await recordBouquetSentOnce(sampleState)
    await recordBouquetSentOnce(sampleState)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/count', { method: 'POST' })
  })
})
