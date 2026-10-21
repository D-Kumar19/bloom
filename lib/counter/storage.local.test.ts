import { promises as fs } from 'fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  incrementBouquetCountValue,
  readBouquetCount,
} from '@/lib/counter/storage'

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

describe('development-only counter file', () => {
  let count: number
  let pending: number
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'development')
    for (const key of [
      'VERCEL',
      'KV_REST_API_URL',
      'KV_REST_API_TOKEN',
      'UPSTASH_REDIS_REST_URL',
      'UPSTASH_REDIS_REST_TOKEN',
    ]) {
      vi.stubEnv(key, '')
    }
    vi.resetAllMocks()
    count = 0
    vi.mocked(fs.readFile).mockImplementation(async () =>
      JSON.stringify({ count })
    )
    vi.mocked(fs.writeFile).mockImplementation(async (_path, value) => {
      pending = JSON.parse(String(value)).count
    })
    vi.mocked(fs.rename).mockImplementation(async () => {
      count = pending
    })
  })
  afterEach(() => vi.unstubAllEnvs())

  it('serializes concurrent increments and publishes files using rename', async () => {
    const results = await Promise.all(
      Array.from({ length: 20 }, () => incrementBouquetCountValue())
    )
    expect(results).toEqual(Array.from({ length: 20 }, (_, i) => i + 1))
    await expect(readBouquetCount()).resolves.toBe(20)
    expect(fs.rename).toHaveBeenCalledTimes(20)
    expect(fs.rm).toHaveBeenCalledTimes(20)
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

  it('cleans up failed writes and allows the next attempt', async () => {
    vi.mocked(fs.rename).mockRejectedValueOnce(new Error('disk failure'))
    await expect(incrementBouquetCountValue()).rejects.toThrow('disk failure')
    expect(fs.rm).toHaveBeenCalled()
    await expect(incrementBouquetCountValue()).resolves.toBe(1)
  })
})
