import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { COUNT_LIMITS, isGiftId, type CountResult } from './contract'
import { RECORD_SHARE_SCRIPT, SHARE_SCRIPT_ARGUMENTS } from './script'

const COUNT_KEY = 'bouquet:count'
const COUNT_FILE = path.join(process.cwd(), 'data', 'bouquet-count.json')
const KV_TIMEOUT_MS = 3000
let fileWriteQueue: Promise<unknown> = Promise.resolve()

function getKvConfig(): { url: string; token: string } | null {
  const useKv = Boolean(
    process.env.KV_REST_API_URL || process.env.KV_REST_API_TOKEN
  )
  const url = (
    useKv ? process.env.KV_REST_API_URL : process.env.UPSTASH_REDIS_REST_URL
  )?.replace(/\/$/, '')
  const token = useKv
    ? process.env.KV_REST_API_TOKEN
    : process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url && !token) {
    return null
  }
  if (!url || !token) {
    throw new Error('Both Redis REST URL and token must be configured')
  }

  return { url, token }
}

function hasKvConfig(): boolean {
  return getKvConfig() !== null
}

async function kvRequest(
  pathSuffix: string,
  method: 'GET' | 'POST',
  command?: string[]
): Promise<unknown> {
  const config = getKvConfig()
  if (!config) {
    throw new Error('KV is not configured')
  }

  const response = await fetch(`${config.url}${pathSuffix}`, {
    method,
    cache: 'no-store',
    signal: AbortSignal.timeout(KV_TIMEOUT_MS),
    headers: {
      Authorization: `Bearer ${config.token}`,
      ...(command ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(command ? { body: JSON.stringify(command) } : {}),
  })

  if (!response.ok) {
    throw new Error(`KV request failed: ${response.status}`)
  }

  const data: unknown = await response.json()
  if (
    !data ||
    typeof data !== 'object' ||
    !('result' in data) ||
    'error' in data
  ) {
    throw new Error('Invalid Redis counter response')
  }
  return data.result
}

function parseCount(value: unknown): number {
  const count =
    typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value
  if (typeof count !== 'number' || !Number.isSafeInteger(count) || count < 0) {
    throw new Error('Invalid bouquet count')
  }
  return count
}

async function readCountFromKv(): Promise<number> {
  const result = await kvRequest(`/get/${COUNT_KEY}`, 'GET')
  return result === null ? 0 : parseCount(result)
}

async function recordShareInKv(
  giftId: string,
  clientKey: string
): Promise<CountResult> {
  const result = await kvRequest('', 'POST', [
    'EVAL',
    RECORD_SHARE_SCRIPT,
    '4',
    COUNT_KEY,
    `bouquet:gift:${giftId}`,
    ...COUNT_LIMITS.map(
      ({ seconds }) => `bouquet:quota:${clientKey}:${seconds}`
    ),
    ...SHARE_SCRIPT_ARGUMENTS,
  ])
  if (!Array.isArray(result) || result.length !== 2) {
    throw new Error('Invalid Redis recording response')
  }
  const [status, value] = result
  if (status === 'counted' || status === 'duplicate') {
    return { status, count: parseCount(value) }
  }
  if (status === 'limited') {
    const retryAfter = parseCount(value)
    if (retryAfter > 0 && retryAfter <= 3600) return { status, retryAfter }
  }
  throw new Error('Invalid Redis recording response')
}

function requireLocalFileStorage(): void {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    throw new Error(
      'Production bouquet counting requires Redis REST configuration'
    )
  }
}

type LocalCounter = {
  count: number
  gifts: string[]
  windows: Record<string, { used: number; expiresAt: number }>
}

async function readCounterFile(): Promise<LocalCounter> {
  try {
    const raw = await fs.readFile(COUNT_FILE, 'utf-8')
    const data: unknown = JSON.parse(raw)
    if (!data || typeof data !== 'object' || !('count' in data)) {
      throw new Error('Invalid local counter file')
    }
    const count = parseCount(data.count)
    const gifts = 'gifts' in data ? data.gifts : []
    const windows = 'windows' in data ? data.windows : {}
    if (
      !Array.isArray(gifts) ||
      !gifts.every(isGiftId) ||
      !windows ||
      typeof windows !== 'object' ||
      Array.isArray(windows)
    ) {
      throw new Error('Invalid local counter tracking')
    }
    const checkedWindows: LocalCounter['windows'] = {}
    for (const [key, value] of Object.entries(windows)) {
      if (
        !value ||
        typeof value !== 'object' ||
        !('used' in value) ||
        !('expiresAt' in value) ||
        typeof value.expiresAt !== 'number' ||
        !Number.isSafeInteger(value.expiresAt) ||
        value.expiresAt < 0
      ) {
        throw new Error('Invalid local counter quota')
      }
      checkedWindows[key] = {
        used: parseCount(value.used),
        expiresAt: value.expiresAt,
      }
    }
    return { count, gifts, windows: checkedWindows }
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      return { count: 0, gifts: [], windows: {} }
    }
    throw error
  }
}

async function writeCountToFile(counter: LocalCounter): Promise<void> {
  await fs.mkdir(path.dirname(COUNT_FILE), { recursive: true })
  const temporaryFile = `${COUNT_FILE}.${randomUUID()}.tmp`
  try {
    await fs.writeFile(temporaryFile, JSON.stringify(counter, null, 2))
    await fs.rename(temporaryFile, COUNT_FILE)
  } finally {
    await fs.rm(temporaryFile, { force: true })
  }
}

export function counterUsesKv(): boolean {
  return hasKvConfig()
}

export async function readBouquetCount(): Promise<number> {
  if (hasKvConfig()) {
    return readCountFromKv()
  }

  requireLocalFileStorage()
  return (await readCounterFile()).count
}

export async function recordBouquetShare(
  giftId: string,
  clientKey: string
): Promise<CountResult> {
  if (!isGiftId(giftId) || !/^[0-9a-f]{64}$/.test(clientKey)) {
    throw new Error('Invalid counter identity')
  }
  if (hasKvConfig()) {
    return recordShareInKv(giftId, clientKey)
  }

  requireLocalFileStorage()
  const increment = fileWriteQueue.then(async () => {
    const current = await readCounterFile()
    const now = Math.floor(Date.now() / 1000)
    current.windows = Object.fromEntries(
      Object.entries(current.windows).filter(
        ([, value]) => value.expiresAt > now
      )
    )
    const windows = COUNT_LIMITS.map(({ seconds, requests }) => {
      const bucket = Math.floor(now / seconds)
      const key = `${clientKey}:${seconds}:${bucket}`
      return {
        key,
        requests,
        used: current.windows[key]?.used ?? 0,
        expiresAt: (bucket + 1) * seconds,
      }
    })
    const retryAfter = Math.max(
      0,
      ...windows
        .filter(({ used, requests }) => used >= requests)
        .map(({ expiresAt }) => expiresAt - now)
    )
    if (retryAfter > 0) return { status: 'limited', retryAfter } as const
    const duplicate = current.gifts.includes(giftId)
    if (!duplicate) {
      current.count = parseCount(current.count + 1)
      current.gifts.push(giftId)
    }
    for (const { key, used, expiresAt } of windows) {
      current.windows[key] = { used: used + 1, expiresAt }
    }
    await writeCountToFile(current)
    return {
      status: duplicate ? 'duplicate' : 'counted',
      count: current.count,
    } as const
  })
  // A failed write must reject its caller without blocking later local attempts.
  fileWriteQueue = increment.catch(() => undefined)
  return increment
}
