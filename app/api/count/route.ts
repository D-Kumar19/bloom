import { NextResponse } from 'next/server'

import { getBouquetCount } from '@/lib/counter'
import { isGiftId, MAX_COUNT_BODY_BYTES } from '@/lib/counter/contract'
import { counterClientKey } from '@/lib/counter/identity'
import { recordBouquetShare } from '@/lib/counter/storage'

const headers = { 'Cache-Control': 'no-store' }

function rejected(status: number, error: string) {
  console.warn(`Bouquet counter request rejected (${status}).`)
  return NextResponse.json({ error }, { status, headers })
}

function unavailable() {
  return NextResponse.json(
    { error: 'Bouquet count is temporarily unavailable' },
    { status: 503, headers }
  )
}

export async function GET() {
  const count = await getBouquetCount()
  return count === null
    ? unavailable()
    : NextResponse.json({ count }, { headers })
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) {
    return rejected(403, 'Cross-origin counting is not allowed')
  }
  if (
    request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !==
    'application/json'
  ) {
    return rejected(415, 'Expected application/json')
  }
  const reader = request.body?.getReader()
  if (!reader) return rejected(400, 'Expected a gift ID')
  let body: unknown
  try {
    const chunks: Uint8Array[] = []
    let length = 0
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      length += value.byteLength
      if (length > MAX_COUNT_BODY_BYTES) {
        await reader.cancel()
        return rejected(413, 'Counter request is too large')
      }
      chunks.push(value)
    }
    body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    return rejected(400, 'Invalid counter request')
  } finally {
    reader.releaseLock()
  }
  if (
    !body ||
    typeof body !== 'object' ||
    !('giftId' in body) ||
    !isGiftId(body.giftId) ||
    Object.keys(body).length !== 1
  ) {
    return rejected(400, 'Expected a valid gift ID only')
  }
  try {
    const result = await recordBouquetShare(
      body.giftId,
      counterClientKey(request)
    )
    if (result.status === 'limited') {
      console.warn('Bouquet counter rate limit reached.')
      return NextResponse.json(
        { error: 'Too many counting requests. Sharing is unaffected.' },
        {
          status: 429,
          headers: { ...headers, 'Retry-After': String(result.retryAfter) },
        }
      )
    }
    return NextResponse.json(result, { headers })
  } catch {
    console.error(
      'Bouquet counter recording failed. Check Redis, trusted client IP, and rate-limit secret configuration.'
    )
    return unavailable()
  }
}
