import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  counterUsesKv,
  incrementBouquetCountValue,
  readBouquetCount,
} from '@/lib/counter/storage'

describe('counter storage', () => {
  beforeEach(() => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ result: 7 }),
      })
    )
    delete process.env.KV_REST_API_URL
    delete process.env.KV_REST_API_TOKEN
  })

  afterEach(() => {
    vi.unstubAllEnvs()
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
      })
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
      })
    )
  })

  it('refuses production filesystem persistence without credentials', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    await expect(readBouquetCount()).rejects.toThrow('requires Redis')
    await expect(incrementBouquetCountValue()).rejects.toThrow('requires Redis')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rejects incomplete configuration instead of falling back to files', async () => {
    process.env.KV_REST_API_URL = 'https://example.upstash.io'
    await expect(readBouquetCount()).rejects.toThrow('Both Redis REST')
  })

  it('accepts Upstash integration environment names', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://example.upstash.io/')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'token')
    await expect(readBouquetCount()).resolves.toBe(7)
    expect(fetch).toHaveBeenCalledWith(
      'https://example.upstash.io/get/bouquet:count',
      expect.objectContaining({
        cache: 'no-store',
        signal: expect.any(AbortSignal),
      })
    )
  })

  it.each([null, '0', '42'])(
    'handles valid Redis GET value %s',
    async (result) => {
      process.env.KV_REST_API_URL = 'https://example.upstash.io'
      process.env.KV_REST_API_TOKEN = 'token'
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ result }),
      } as Response)
      await expect(readBouquetCount()).resolves.toBe(
        result === null ? 0 : Number(result)
      )
    }
  )

  it.each(['invalid', -1, 1.5, false, '9007199254740992'])(
    'rejects corrupt counts: %s',
    async (result) => {
      process.env.KV_REST_API_URL = 'https://example.upstash.io'
      process.env.KV_REST_API_TOKEN = 'token'
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ result }),
      } as Response)
      await expect(readBouquetCount()).rejects.toThrow('Invalid bouquet count')
    }
  )

  it('rejects a Redis command error even with HTTP 200', async () => {
    process.env.KV_REST_API_URL = 'https://example.upstash.io'
    process.env.KV_REST_API_TOKEN = 'token'
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ error: 'ERR' }),
    } as Response)
    await expect(incrementBouquetCountValue()).rejects.toThrow('Invalid Redis')
  })
})
