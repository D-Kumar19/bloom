import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { BouquetState } from '@/lib/types'

let record: typeof import('./recordBouquetSent').recordBouquetSentOnce
let state: BouquetState
const success = () =>
  new Response(JSON.stringify({ status: 'counted', count: 1 }))

describe('recordBouquetSentOnce', () => {
  beforeEach(async () => {
    vi.resetModules()
    localStorage.clear()
    record = (await import('./recordBouquetSent')).recordBouquetSentOnce
    state = {
      giftId: crypto.randomUUID(),
      bouquetId: 'red-rose-classic',
      cardStyle: 'classic-cream',
      to: 'Sam',
      from: 'Alex',
      message: 'Thinking of you',
      theme: 'warm',
      soundtrack: 'none',
    }
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('posts only the gift ID once, despite edits and concurrent clicks', async () => {
    const fetchMock = vi.fn().mockImplementation(success)
    vi.stubGlobal('fetch', fetchMock)
    await Promise.all([record(state), record(state)])
    await record({ ...state, message: 'An edit' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/count',
      expect.objectContaining({
        method: 'POST',
        keepalive: true,
        signal: expect.any(AbortSignal),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giftId: state.giftId }),
      })
    )
    expect(localStorage.getItem('bloom-counted-gift-ids')).not.toContain(
      state.message
    )
  })

  it('remembers IDs across module reloads, but a new ID counts separately', async () => {
    const fetchMock = vi.fn().mockImplementation(success)
    vi.stubGlobal('fetch', fetchMock)
    await record(state)
    vi.resetModules()
    const reloaded = (await import('./recordBouquetSent')).recordBouquetSentOnce
    await reloaded(state)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    await reloaded({ ...state, giftId: crypto.randomUUID() })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('retries ambiguous failures with the same ID and accepts a server duplicate', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('Response lost after server increment'))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ status: 'duplicate', count: 1 }))
      )
    vi.stubGlobal('fetch', fetchMock)
    await record(state)
    await record(state)
    await record(state)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[0][1].body).toBe(
      fetchMock.mock.calls[1][1].body
    )
  })

  it('keeps sharing usable when local storage is blocked', async () => {
    const logger = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fetchMock = vi.fn().mockImplementation(success)
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    await expect(record(state)).resolves.toBeUndefined()
    await record(state)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(logger).toHaveBeenCalled()
  })

  it('releases in-flight tracking even if fetch throws synchronously', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() => {
        throw new TypeError('Network unavailable')
      })
      .mockImplementationOnce(success)
    vi.stubGlobal('fetch', fetchMock)
    await record(state)
    await record(state)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('honors Retry-After across IDs without suppressing a later explicit retry', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    let now = 100000
    vi.spyOn(Date, 'now').mockImplementation(() => now)
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response('{}', { status: 429, headers: { 'Retry-After': '60' } })
      )
      .mockImplementationOnce(success)
    vi.stubGlobal('fetch', fetchMock)
    await record(state)
    await record(state)
    await record({ ...state, giftId: crypto.randomUUID() })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    now += 60000
    await record(state)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not mark malformed successful responses as counted', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}'))
    vi.stubGlobal('fetch', fetchMock)
    await record(state)
    expect(localStorage.getItem('bloom-counted-gift-ids')).toBeNull()
  })

  it('logs missing gift IDs instead of sending an unprotected request', async () => {
    const logger = vi.spyOn(console, 'error').mockImplementation(() => {})
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    await record({ ...state, giftId: undefined })
    expect(fetchMock).not.toHaveBeenCalled()
    expect(logger).toHaveBeenCalled()
  })
})
