import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { counterUsesKv, recordBouquetShare, readBouquetCount } from './storage'

const giftId = '12345678-1234-4234-8234-123456789012'
const clientKey = 'a'.repeat(64)
function result(value: unknown) {
  vi.mocked(fetch).mockResolvedValue(
    new Response(JSON.stringify({ result: value }))
  )
}

describe('counter storage', () => {
  beforeEach(() => {
    vi.stubEnv('VERCEL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
    vi.stubEnv('KV_REST_API_URL', 'https://example.upstash.io')
    vi.stubEnv('KV_REST_API_TOKEN', 'test-credential')
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('uses Redis and reads the count without caching', async () => {
    expect(counterUsesKv()).toBe(true)
    result('7')
    await expect(readBouquetCount()).resolves.toBe(7)
    expect(fetch).toHaveBeenCalledWith(
      'https://example.upstash.io/get/bouquet:count',
      expect.objectContaining({
        cache: 'no-store',
        signal: expect.any(AbortSignal),
      })
    )
  })

  it('records with one atomic Redis script, never a bare INCR', async () => {
    result(['counted', 8])
    await expect(recordBouquetShare(giftId, clientKey)).resolves.toEqual({
      status: 'counted',
      count: 8,
    })
    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, options] = vi.mocked(fetch).mock.calls[0]
    expect(url).toBe('https://example.upstash.io')
    expect(options?.method).toBe('POST')
    const command: unknown = JSON.parse(String(options?.body))
    expect(command).toEqual([
      'EVAL',
      expect.stringContaining("redis.pcall('INCR', KEYS[1])"),
      '4',
      'bouquet:count',
      `bouquet:gift:${giftId}`,
      `bouquet:quota:${clientKey}:60`,
      `bouquet:quota:${clientKey}:3600`,
      '60',
      '10',
      '3600',
      '50',
    ])
  })

  it('refuses production filesystem persistence and incomplete configuration', async () => {
    vi.stubEnv('KV_REST_API_URL', '')
    vi.stubEnv('KV_REST_API_TOKEN', '')
    vi.stubEnv('NODE_ENV', 'production')
    await expect(readBouquetCount()).rejects.toThrow('requires Redis')
    await expect(recordBouquetShare(giftId, clientKey)).rejects.toThrow(
      'requires Redis'
    )
    vi.stubEnv('KV_REST_API_URL', 'https://example.upstash.io')
    await expect(readBouquetCount()).rejects.toThrow('Both Redis REST')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('accepts the native Upstash credential names', async () => {
    vi.stubEnv('KV_REST_API_URL', '')
    vi.stubEnv('KV_REST_API_TOKEN', '')
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://example.upstash.io/')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-credential')
    result(7)
    await expect(readBouquetCount()).resolves.toBe(7)
    expect(fetch).toHaveBeenCalledWith(
      'https://example.upstash.io/get/bouquet:count',
      expect.any(Object)
    )
  })

  it.each([null, '0', '42'])('handles Redis GET value %s', async (value) => {
    result(value)
    await expect(readBouquetCount()).resolves.toBe(
      value === null ? 0 : Number(value)
    )
  })

  it.each(['invalid', -1, 1.5, false, '9007199254740992'])(
    'rejects corrupt count %s',
    async (value) => {
      result(value)
      await expect(readBouquetCount()).rejects.toThrow('Invalid bouquet count')
    }
  )

  it.each([
    { raw: ['duplicate', 7], expected: { status: 'duplicate', count: 7 } },
    { raw: ['limited', 60], expected: { status: 'limited', retryAfter: 60 } },
  ])('parses recording response $raw', async ({ raw, expected }) => {
    result(raw)
    await expect(recordBouquetShare(giftId, clientKey)).resolves.toEqual(
      expected
    )
  })

  it.each([
    { raw: ['limited', 0] },
    { raw: ['limited', 3601] },
    { raw: ['counted', -1] },
    { raw: ['other', 1] },
    { raw: 7 },
  ])('rejects malformed recording response $raw', async ({ raw }) => {
    result(raw)
    await expect(recordBouquetShare(giftId, clientKey)).rejects.toThrow()
  })

  it('rejects command errors and HTTP failures', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'ERR' }))
    )
    await expect(recordBouquetShare(giftId, clientKey)).rejects.toThrow(
      'Invalid Redis'
    )
    vi.mocked(fetch).mockResolvedValueOnce(new Response('', { status: 503 }))
    await expect(recordBouquetShare(giftId, clientKey)).rejects.toThrow('503')
  })
})
