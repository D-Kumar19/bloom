import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GET, POST } from '@/app/api/count/route'
import { getBouquetCount } from '@/lib/counter'
import { recordBouquetShare } from '@/lib/counter/storage'

vi.mock('@/lib/counter', () => ({ getBouquetCount: vi.fn() }))
vi.mock('@/lib/counter/storage', () => ({ recordBouquetShare: vi.fn() }))

const giftId = '12345678-1234-4234-8234-123456789012'
function request(
  body: unknown = { giftId },
  headers: Record<string, string> = {}
) {
  return new Request('https://bloom.example/api/count', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-vercel-forwarded-for': '203.0.113.1',
      ...headers,
    },
    body: JSON.stringify(body),
  })
}

describe('counter API', () => {
  beforeEach(() => {
    vi.stubEnv('VERCEL', '1')
    vi.stubEnv(
      'COUNTER_RATE_LIMIT_SECRET',
      'a-test-secret-with-at-least-32-characters'
    )
    vi.mocked(recordBouquetShare).mockResolvedValue({
      status: 'counted',
      count: 11,
    })
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
    vi.unstubAllEnvs()
  })

  it('returns fresh reads and records a gift without passing raw IPs to storage', async () => {
    vi.mocked(getBouquetCount).mockResolvedValue(10)
    const read = await GET()
    const write = await POST(request())
    expect(await read.json()).toEqual({ count: 10 })
    expect(await write.json()).toEqual({ status: 'counted', count: 11 })
    expect(read.headers.get('Cache-Control')).toBe('no-store')
    expect(write.headers.get('Cache-Control')).toBe('no-store')
    expect(recordBouquetShare).toHaveBeenCalledWith(
      giftId,
      expect.stringMatching(/^[0-9a-f]{64}$/)
    )
  })

  it('returns a duplicate without incrementing and a limited response with Retry-After', async () => {
    vi.mocked(recordBouquetShare).mockResolvedValueOnce({
      status: 'duplicate',
      count: 11,
    })
    expect(await (await POST(request())).json()).toEqual({
      status: 'duplicate',
      count: 11,
    })
    vi.mocked(recordBouquetShare).mockResolvedValueOnce({
      status: 'limited',
      retryAfter: 45,
    })
    const response = await POST(request())
    expect(response.status).toBe(429)
    expect(response.headers.get('Retry-After')).toBe('45')
  })

  it.each([
    {},
    { giftId: 'invalid' },
    { giftId: 'ABCDEF01-1234-4234-8234-123456789012' },
    { giftId, message: 'private' },
  ])(
    'rejects an invalid request without accessing storage: %j',
    async (body) => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
      expect((await POST(request(body))).status).toBe(400)
      expect(recordBouquetShare).not.toHaveBeenCalled()
    }
  )

  it('rejects oversized bodies, including missing or false Content-Length', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const cases: Record<string, string>[] = [{}, { 'Content-Length': '1' }]
    for (const headers of cases) {
      const response = await POST(
        request({ giftId, padding: 'x'.repeat(200) }, headers)
      )
      expect(response.status).toBe(413)
    }
    expect(recordBouquetShare).not.toHaveBeenCalled()
  })

  it('rejects malformed JSON, cross-origin requests and unsupported content types', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const malformed = new Request('https://bloom.example/api/count', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{',
    })
    expect((await POST(malformed)).status).toBe(400)
    expect(
      (await POST(request({ giftId }, { Origin: 'https://other.example' })))
        .status
    ).toBe(403)
    expect(
      (await POST(request({ giftId }, { 'Content-Type': 'text/plain' }))).status
    ).toBe(415)
    expect(recordBouquetShare).not.toHaveBeenCalled()
  })

  it('fails closed without trusted IP or a secret and never trusts arbitrary forwarded headers', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(
      (
        await POST(
          request(
            { giftId },
            { 'x-vercel-forwarded-for': '', 'x-forwarded-for': '1.2.3.4' }
          )
        )
      ).status
    ).toBe(503)
    vi.stubEnv('COUNTER_RATE_LIMIT_SECRET', '')
    expect((await POST(request())).status).toBe(503)
    vi.stubEnv('VERCEL', '')
    vi.stubEnv('NODE_ENV', 'production')
    expect((await POST(request())).status).toBe(503)
    expect(recordBouquetShare).not.toHaveBeenCalled()
  })

  it('uses a shared development identity rather than trusting request headers off Vercel', async () => {
    vi.stubEnv('VERCEL', '')
    vi.stubEnv('NODE_ENV', 'development')
    await POST(request())
    await POST(
      request({ giftId }, { 'x-vercel-forwarded-for': '198.51.100.2' })
    )
    expect(vi.mocked(recordBouquetShare).mock.calls[0][1]).toBe(
      vi.mocked(recordBouquetShare).mock.calls[1][1]
    )
  })

  it('normalizes equivalent IPv6 addresses before hashing quotas', async () => {
    await POST(request({ giftId }, { 'x-vercel-forwarded-for': '2001:db8::1' }))
    await POST(
      request(
        { giftId },
        { 'x-vercel-forwarded-for': '2001:0db8:0000:0000:0000:0000:0000:0001' }
      )
    )
    expect(vi.mocked(recordBouquetShare).mock.calls[0][1]).toBe(
      vi.mocked(recordBouquetShare).mock.calls[1][1]
    )
  })

  it('returns 503, never a fake zero, if reading fails', async () => {
    vi.mocked(getBouquetCount).mockResolvedValue(null)
    expect((await GET()).status).toBe(503)
  })

  it('logs write failures without exposing upstream details', async () => {
    const logger = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(recordBouquetShare).mockRejectedValue(
      new Error('private upstream error')
    )
    const response = await POST(request())
    expect(response.status).toBe(503)
    expect(JSON.stringify(await response.json())).not.toContain('private')
    expect(logger).toHaveBeenCalled()
  })
})
