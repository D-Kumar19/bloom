export const MAX_COUNT_BODY_BYTES = 128
export const COUNT_LIMITS = [
  { seconds: 60, requests: 10 },
  { seconds: 3600, requests: 50 },
] as const

export function isGiftId(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
      value
    )
  )
}

export type CountResult =
  | { status: 'counted' | 'duplicate'; count: number }
  | { status: 'limited'; retryAfter: number }
