import { getBouquetById } from '@/lib/bouquets'
import type { BouquetState } from '@/lib/types'

export async function renderBouquetImage(bouquet: BouquetState): Promise<Blob> {
  if (!getBouquetById(bouquet.bouquetId)) {
    throw new Error('Bouquet not found')
  }
  const { captureBouquetSnapshot } = await import('./BouquetSnapshot')
  return captureBouquetSnapshot(bouquet)
}
