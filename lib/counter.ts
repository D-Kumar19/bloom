import { incrementBouquetCountValue, readBouquetCount } from '@/lib/counter/storage'

export { counterUsesKv } from '@/lib/counter/storage'

export async function getBouquetCount(): Promise<number | null> {
  try {
    return await readBouquetCount()
  } catch {
    console.error('Bouquet counter read failed. Check Redis availability and configuration.')
    return null
  }
}

export async function incrementBouquetCount(): Promise<number> {
  return incrementBouquetCountValue()
}
