import { promises as fs } from 'fs'
import path from 'path'

const COUNT_FILE = path.join(process.cwd(), 'data', 'bouquet-count.json')

async function readCount(): Promise<number> {
  try {
    const raw = await fs.readFile(COUNT_FILE, 'utf-8')
    const data = JSON.parse(raw) as { count: number }
    return typeof data.count === 'number' ? data.count : 0
  } catch {
    return 0
  }
}

async function writeCount(count: number): Promise<void> {
  await fs.mkdir(path.dirname(COUNT_FILE), { recursive: true })
  await fs.writeFile(COUNT_FILE, JSON.stringify({ count }, null, 2))
}

export async function getBouquetCount(): Promise<number> {
  return readCount()
}

export async function incrementBouquetCount(): Promise<number> {
  const current = await readCount()
  const next = current + 1
  await writeCount(next)
  return next
}
