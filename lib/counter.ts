import { readBouquetCount } from '@/lib/counter/storage'
import { logCounterFailure } from '@/lib/counter/errors'

export { counterUsesKv } from '@/lib/counter/storage'

export async function getBouquetCount(): Promise<number | null> {
  try {
    return await readBouquetCount()
  } catch (error) {
    logCounterFailure('read', error)
    return null
  }
}
