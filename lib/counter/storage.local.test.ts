import { promises as fs } from 'fs'
import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { recordBouquetShare, readBouquetCount } from './storage'

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>()
  const promises = {
    ...actual.promises,
    readFile: vi.fn(),
    mkdir: vi.fn(),
    writeFile: vi.fn(),
    rename: vi.fn(),
    rm: vi.fn(),
  }
  return { ...actual, promises, default: { ...actual, promises } }
})
const client = 'a'.repeat(64)

describe('development-only counter file', () => {
  let saved: string
  let pending: string
  let now: number
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'development')
    for (const key of [
      'VERCEL',
      'KV_REST_API_URL',
      'KV_REST_API_TOKEN',
      'UPSTASH_REDIS_REST_URL',
      'UPSTASH_REDIS_REST_TOKEN',
    ])
      vi.stubEnv(key, '')
    vi.resetAllMocks()
    now = Date.UTC(2026, 9, 22, 12)
    vi.spyOn(Date, 'now').mockImplementation(() => now)
    saved = JSON.stringify({ count: 100 })
    vi.mocked(fs.readFile).mockImplementation(async () => saved)
    vi.mocked(fs.writeFile).mockImplementation(async (_path, value) => {
      pending = String(value)
    })
    vi.mocked(fs.rename).mockImplementation(async () => {
      saved = pending
    })
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('serializes simultaneous duplicates and preserves the historical total', async () => {
    const id = randomUUID()
    const results = await Promise.all(
      Array.from({ length: 10 }, () => recordBouquetShare(id, client))
    )
    expect(results[0]).toEqual({ status: 'counted', count: 101 })
    expect(results.slice(1)).toEqual(
      Array(9).fill({ status: 'duplicate', count: 101 })
    )
    await expect(readBouquetCount()).resolves.toBe(101)
  })

  it('allows ten requests per fixed minute and fifty per fixed hour, including duplicates', async () => {
    for (let minute = 0; minute < 5; minute++) {
      now = Date.UTC(2026, 9, 22, 12, minute)
      for (let i = 0; i < 10; i++) {
        expect((await recordBouquetShare(randomUUID(), client)).status).toBe(
          'counted'
        )
      }
      const limited = await recordBouquetShare(randomUUID(), client)
      expect(limited).toEqual({
        status: 'limited',
        retryAfter: minute === 4 ? 3360 : 60,
      })
    }
    now += 60000
    await expect(recordBouquetShare(randomUUID(), client)).resolves.toEqual({
      status: 'limited',
      retryAfter: 3300,
    })
    now = Date.UTC(2026, 9, 22, 13)
    expect((await recordBouquetShare(randomUUID(), client)).status).toBe(
      'counted'
    )
    expect(Object.keys(JSON.parse(saved).windows)).toHaveLength(2)
  })

  it('separates client quotas but deduplicates a gift across clients', async () => {
    const id = randomUUID()
    await recordBouquetShare(id, client)
    await expect(recordBouquetShare(id, 'b'.repeat(64))).resolves.toEqual({
      status: 'duplicate',
      count: 101,
    })
  })

  it('only treats a genuinely missing file as zero', async () => {
    vi.mocked(fs.readFile).mockRejectedValueOnce(
      Object.assign(new Error('missing'), { code: 'ENOENT' })
    )
    await expect(readBouquetCount()).resolves.toBe(0)
    vi.mocked(fs.readFile).mockRejectedValueOnce(
      Object.assign(new Error('denied'), { code: 'EACCES' })
    )
    await expect(readBouquetCount()).rejects.toThrow('denied')
    vi.mocked(fs.readFile).mockResolvedValueOnce('bad json')
    await expect(readBouquetCount()).rejects.toThrow()
  })

  it('cleans up failed writes and allows a retry with the same ID', async () => {
    const id = randomUUID()
    vi.mocked(fs.rename).mockRejectedValueOnce(new Error('disk failure'))
    await expect(recordBouquetShare(id, client)).rejects.toThrow('disk failure')
    expect(fs.rm).toHaveBeenCalled()
    await expect(recordBouquetShare(id, client)).resolves.toEqual({
      status: 'counted',
      count: 101,
    })
  })
})
