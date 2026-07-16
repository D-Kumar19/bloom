import { incrementBouquetCountValue, readBouquetCount } from '@/lib/counter/storage'

export { counterUsesKv } from '@/lib/counter/storage'

export async function getBouquetCount(): Promise<number> {
  return readBouquetCount()
}

export async function incrementBouquetCount(): Promise<number> {
  return incrementBouquetCountValue()
}
