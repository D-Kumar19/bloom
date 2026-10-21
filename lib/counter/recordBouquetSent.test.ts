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
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/count',
      expect.objectContaining({
        method: 'POST',
        keepalive: true,
        signal: expect.any(AbortSignal),
      })
    )
  })

  it('coalesces simultaneous requests for the same gift', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    const state = { ...sampleState, message: 'Concurrent gift' }
    await Promise.all([
      recordBouquetSentOnce(state),
      recordBouquetSentOnce(state),
    ])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('logs a failed request and allows an explicit later retry', async () => {
    const logger = vi.spyOn(console, 'error').mockImplementation(() => {})
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    const state = { ...sampleState, message: 'Retry gift' }
    await recordBouquetSentOnce(state)
    expect(logger).toHaveBeenCalled()
    await recordBouquetSentOnce(state)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not fail sharing when session storage is blocked', async () => {
    const logger = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    const state = { ...sampleState, message: 'Blocked storage gift' }
    await expect(recordBouquetSentOnce(state)).resolves.toBeUndefined()
    await recordBouquetSentOnce(state)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(logger).toHaveBeenCalled()
  })

  it('releases in-flight tracking even if fetch throws synchronously', async () => {
    const logger = vi.spyOn(console, 'error').mockImplementation(() => {})
    const fetchMock = vi.fn()
      .mockImplementationOnce(() => { throw new TypeError('Network unavailable') })
      .mockResolvedValueOnce({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    const state = { ...sampleState, message: 'Synchronous failure gift' }
    await recordBouquetSentOnce(state)
    await recordBouquetSentOnce(state)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(logger).toHaveBeenCalled()
  })
})
