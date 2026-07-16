import { promises as fs } from 'fs'
import path from 'path'

const COUNT_KEY = 'bouquet:count'
const COUNT_FILE = path.join(process.cwd(), 'data', 'bouquet-count.json')

function getKvConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL?.replace(/\/$/, '')
  const token = process.env.KV_REST_API_TOKEN

  if (!url || !token) {
    return null
  }

  return { url, token }
}

function useKv(): boolean {
  return getKvConfig() !== null
}

async function kvRequest<T>(pathSuffix: string): Promise<T> {
  const config = getKvConfig()
  if (!config) {
    throw new Error('KV is not configured')
  }

  const response = await fetch(`${config.url}${pathSuffix}`, {
    headers: {
      Authorization: `Bearer ${config.token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`KV request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

async function readCountFromKv(): Promise<number> {
  const data = await kvRequest<{ result: string | null }>(`/get/${COUNT_KEY}`)
  if (!data.result) {
    return 0
  }

  const parsed = Number(JSON.parse(data.result))
  return Number.isFinite(parsed) ? parsed : 0
}

async function incrementCountInKv(): Promise<number> {
  const data = await kvRequest<{ result: number }>(`/incr/${COUNT_KEY}`)
  return data.result
}

async function readCountFromFile(): Promise<number> {
  try {
    const raw = await fs.readFile(COUNT_FILE, 'utf-8')
    const data = JSON.parse(raw) as { count: number }
    return typeof data.count === 'number' ? data.count : 0
  } catch {
    return 0
  }
}

async function writeCountToFile(count: number): Promise<void> {
  await fs.mkdir(path.dirname(COUNT_FILE), { recursive: true })
  await fs.writeFile(COUNT_FILE, JSON.stringify({ count }, null, 2))
}

export function counterUsesKv(): boolean {
  return useKv()
}

export async function readBouquetCount(): Promise<number> {
  if (useKv()) {
    return readCountFromKv()
  }

  return readCountFromFile()
}

export async function incrementBouquetCountValue(): Promise<number> {
  if (useKv()) {
    return incrementCountInKv()
  }

  const current = await readCountFromFile()
  const next = current + 1
  await writeCountToFile(next)
  return next
}
