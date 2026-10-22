import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import LandingPage from '@/app/page'
import { getBouquetCount } from '@/lib/counter'
import { readBouquetCount } from '@/lib/counter/storage'

vi.mock('@/lib/counter/storage', () => ({
  readBouquetCount: vi.fn(),
  recordBouquetShare: vi.fn(),
}))

describe('optional counter reads', () => {
  afterEach(() => vi.restoreAllMocks())

  it('logs a storage failure and renders the homepage with an unavailable statistic', async () => {
    const logger = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(readBouquetCount).mockRejectedValue(
      new Error('Redis unavailable')
    )
    render(await LandingPage())
    expect(
      screen.getByText('Bouquet count temporarily unavailable')
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Be the first to prepare a bouquet to share')
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Create your bouquet' })
    ).toHaveAttribute('href', '/create')
    expect(logger).toHaveBeenCalled()
  })

  it('does not confuse a real zero with a failed read', async () => {
    vi.mocked(readBouquetCount).mockResolvedValue(0)
    await expect(getBouquetCount()).resolves.toBe(0)
  })
})
