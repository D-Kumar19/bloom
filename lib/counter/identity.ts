import { createHmac } from 'crypto'
import { isIP } from 'net'
import { CounterError } from './errors'

export function counterClientKey(request: Request): string {
  if (process.env.VERCEL === '1') {
    const ip = request.headers.get('x-vercel-forwarded-for')?.trim()
    const secret = process.env.COUNTER_RATE_LIMIT_SECRET
    if (!ip || !isIP(ip)) {
      throw new CounterError(
        'client_ip_missing',
        'Counter requires a trusted Vercel IP'
      )
    }
    if (!secret || secret.length < 32) {
      throw new CounterError(
        'rate_limit_secret_invalid',
        'Counter requires a rate-limit secret'
      )
    }
    const normalized = isIP(ip) === 6 ? new URL(`http://[${ip}]`).hostname : ip
    return createHmac('sha256', secret).update(normalized).digest('hex')
  }
  if (process.env.NODE_ENV === 'production') {
    throw new CounterError(
      'client_platform_unsupported',
      'Counter IP protection requires Vercel in production'
    )
  }
  // Local development has no trusted proxy: all requests share one quota.
  return createHmac('sha256', 'bloom-local-development')
    .update('localhost')
    .digest('hex')
}
