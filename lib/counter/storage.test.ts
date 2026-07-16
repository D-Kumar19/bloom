import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { counterUsesKv, incrementBouquetCountValue, readBouquetCount } from '@/lib/counter/storage'

describe('counter storage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ result: 7 }),
      }),
    )
    delete process.env.KV_REST_API_URL
    delete process.env.KV_REST_API_TOKEN
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.KV_REST_API_URL
    delete process.env.KV_REST_API_TOKEN
  })

  it('uses kv when rest credentials are configured', () => {
    process.env.KV_REST_API_URL = 'https://example.upstash.io'
    process.env.KV_REST_API_TOKEN = 'token'

    expect(counterUsesKv()).toBe(true)
  })

  it('reads the count from kv', async () => {
    process.env.KV_REST_API_URL = 'https://example.upstash.io'
    process.env.KV_REST_API_TOKEN = 'token'

    await expect(readBouquetCount()).resolves.toBe(7)
    expect(fetch).toHaveBeenCalledWith(
      'https://example.upstash.io/get/bouquet:count',
      expect.objectContaining({
        headers: { Authorization: 'Bearer token' },
      }),
    )
  })

  it('increments atomically in kv', async () => {
    process.env.KV_REST_API_URL = 'https://example.upstash.io'
    process.env.KV_REST_API_TOKEN = 'token'
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ result: 8 }),
    } as Response)

    await expect(incrementBouquetCountValue()).resolves.toBe(8)
    expect(fetch).toHaveBeenCalledWith(
      'https://example.upstash.io/incr/bouquet:count',
      expect.objectContaining({
        headers: { Authorization: 'Bearer token' },
      }),
    )
  })
})
