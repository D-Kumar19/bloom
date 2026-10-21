import { afterEach, describe, expect, it, vi } from 'vitest'
import { GET, POST } from '@/app/api/count/route'
import { getBouquetCount, incrementBouquetCount } from '@/lib/counter'

vi.mock('@/lib/counter', () => ({
  getBouquetCount: vi.fn(),
  incrementBouquetCount: vi.fn(),
}))

describe('counter API', () => {
  afterEach(() => vi.restoreAllMocks())

  it('returns a fresh count on GET and POST', async () => {
    vi.mocked(getBouquetCount).mockResolvedValue(10)
    vi.mocked(incrementBouquetCount).mockResolvedValue(11)
    const read = await GET()
    const write = await POST()
    expect(await read.json()).toEqual({ count: 10 })
    expect(await write.json()).toEqual({ count: 11 })
    expect(read.headers.get('Cache-Control')).toBe('no-store')
    expect(write.headers.get('Cache-Control')).toBe('no-store')
  })

  it('returns 503, never a fake zero, if reading fails', async () => {
    vi.mocked(getBouquetCount).mockResolvedValue(null)
    const response = await GET()
    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({
      error: 'Bouquet count is temporarily unavailable',
    })
  })

  it('logs write failures and returns a controlled response', async () => {
    const logger = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(incrementBouquetCount).mockRejectedValue(
      new Error('private upstream error')
    )
    const response = await POST()
    expect(response.status).toBe(503)
    expect(JSON.stringify(await response.json())).not.toContain('private')
    expect(logger).toHaveBeenCalled()
  })
})
