import { describe, expect, it, vi } from 'vitest'
import { renderBouquetImage } from '@/lib/export/renderBouquetImage'
import { captureBouquetSnapshot } from '@/lib/export/BouquetSnapshot'
import type { BouquetState } from '@/lib/types'

vi.mock('@/lib/export/BouquetSnapshot', () => ({ captureBouquetSnapshot: vi.fn() }))
const bouquet: BouquetState = {
  bouquetId: 'red-rose-classic', cardStyle: 'midnight',
  to: 'Sam', from: 'Alex', message: '<b>Hello</b><br>friend', theme: 'midnight',
}
describe('renderBouquetImage', () => {
  it('passes the complete gift unchanged to the shared-component snapshot', async () => {
    const png = new Blob(['png'], { type: 'image/png' })
    vi.mocked(captureBouquetSnapshot).mockResolvedValueOnce(png)
    await expect(renderBouquetImage(bouquet)).resolves.toBe(png)
    expect(captureBouquetSnapshot).toHaveBeenCalledWith(bouquet)
  })
  it('rejects invalid gifts explicitly', async () => {
    await expect(renderBouquetImage({ ...bouquet, bouquetId: 'missing' })).rejects.toThrow('Bouquet not found')
  })
  it('propagates capture failures so the save action can show an error', async () => {
    vi.mocked(captureBouquetSnapshot).mockRejectedValueOnce(new Error('Image failed'))
    await expect(renderBouquetImage(bouquet)).rejects.toThrow('Image failed')
  })
})
