import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Footer } from '@/components/ui/Footer'
import PrivacyPage from '@/app/privacy/page'

vi.mock('@/lib/counter', () => ({ getBouquetCount: vi.fn().mockResolvedValue(null) }))
vi.mock('next/server', () => ({ connection: vi.fn().mockResolvedValue(undefined) }))
describe('honest navigation and privacy', () => {
  it('links to real pages and labels unavailable destinations rather than redirecting elsewhere', async () => {
    render(await Footer())
    expect(screen.getAllByRole('link', { name: 'Privacy' })[0]).toHaveAttribute('href', '/privacy')
    expect(screen.getAllByRole('link', { name: 'About' })[0]).toHaveAttribute('href', '/about')
    expect(screen.queryByRole('link', { name: 'Contact' })).not.toBeInTheDocument()
    expect(screen.getAllByText('Contact')[0]).toHaveTextContent('not available yet')
    expect(document.querySelector('a[href="/pre-release"]')).toBeNull()
  })
  it('explains URL access, server processing, local drafts, and counter limitations', () => {
    render(<PrivacyPage />)
    expect(screen.getByText(/Compression is not encryption/)).toBeInTheDocument()
    expect(screen.getByText(/query parameter sent/)).toBeInTheDocument()
    expect(screen.getByText(/Expired drafts are/)).toBeInTheDocument()
    expect(screen.getByText(/does not prove/)).toBeInTheDocument()
  })
})
