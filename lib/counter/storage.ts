import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

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
  method: 'GET' | 'POST'
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
    },
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

async function incrementCountInKv(): Promise<number> {
  return parseCount(await kvRequest(`/incr/${COUNT_KEY}`, 'POST'))
}

function requireLocalFileStorage(): void {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    throw new Error(
      'Production bouquet counting requires Redis REST configuration'
    )
  }
}

async function readCountFromFile(): Promise<number> {
  try {
    const raw = await fs.readFile(COUNT_FILE, 'utf-8')
    const data: unknown = JSON.parse(raw)
    if (!data || typeof data !== 'object' || !('count' in data)) {
      throw new Error('Invalid local counter file')
    }
    return parseCount(data.count)
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      return 0
    }
    throw error
  }
}

async function writeCountToFile(count: number): Promise<void> {
  await fs.mkdir(path.dirname(COUNT_FILE), { recursive: true })
  const temporaryFile = `${COUNT_FILE}.${randomUUID()}.tmp`
  try {
    await fs.writeFile(temporaryFile, JSON.stringify({ count }, null, 2))
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
  return readCountFromFile()
}

export async function incrementBouquetCountValue(): Promise<number> {
  if (hasKvConfig()) {
    return incrementCountInKv()
  }

  requireLocalFileStorage()
  const increment = fileWriteQueue.then(async () => {
    const current = await readCountFromFile()
    const next = parseCount(current + 1)
    await writeCountToFile(next)
    return next
  })
  // A failed write must reject its caller without blocking later local attempts.
  fileWriteQueue = increment.catch(() => undefined)
  return increment
}
