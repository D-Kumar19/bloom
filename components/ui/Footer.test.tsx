import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Footer } from '@/components/ui/Footer'
import PrivacyPage from '@/app/privacy/page'
import ContactPage from '@/app/contact/page'
import ExplorePage from '@/app/explore/page'

vi.mock('@/lib/counter', () => ({ getBouquetCount: vi.fn().mockResolvedValue(null) }))
vi.mock('next/server', () => ({ connection: vi.fn().mockResolvedValue(undefined) }))
describe('honest navigation and privacy', () => {
  it('links each discovery destination to its own page and starts new bouquets explicitly', async () => {
    render(await Footer())
    expect(screen.getAllByRole('link', { name: 'Privacy' })[0]).toHaveAttribute('href', '/privacy')
    expect(screen.getAllByRole('link', { name: 'About' })[0]).toHaveAttribute('href', '/about')
    expect(screen.getAllByRole('link', { name: 'Contact' })[0]).toHaveAttribute('href', '/contact')
    render(<ExplorePage />)
    for (const [label, id] of [
      ['Flowers', 'flowers'], ['Note styles', 'note-styles'],
      ['Backdrops', 'backdrops'], ['Ambient sound', 'ambient-sound'],
      ['Templates', 'templates'],
    ]) {
      for (const link of screen.getAllByRole('link', { name: label })) {
        expect(link).toHaveAttribute('href', `/${id}`)
      }
      expect(document.getElementById(id)).toContainElement(screen.getByRole('heading', { name: label }))
    }
    expect(screen.queryByText(/not available yet/)).not.toBeInTheDocument()
    expect(document.querySelector('a[href="/pre-release"]')).toBeNull()
    for (const link of screen.getAllByRole('link', { name: 'New bouquet' })) {
      expect(link).toHaveAttribute('href', '/create?new=1')
    }
  })
  it('offers editable occasion starters, the builder, and contact destinations', () => {
    render(<ExplorePage />)
    expect(screen.getByText(/The note is yours to write/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Explore templates' })).toHaveAttribute('href', '/templates')
    expect(screen.getByRole('link', { name: 'Create your bouquet' })).toHaveAttribute('href', '/create?new=1')
    expect(screen.getByRole('link', { name: 'Tell Dheeraj' })).toHaveAttribute('href', '/contact')
  })
  it('explains URL access, server processing, local drafts, and counter limitations', () => {
    render(<PrivacyPage />)
    expect(screen.getByText(/Compression is not encryption/)).toBeInTheDocument()
    expect(screen.getByText(/query parameter sent/)).toBeInTheDocument()
    expect(screen.getByText(/Expired drafts are/)).toBeInTheDocument()
    expect(screen.getByText(/does not prove/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dheeraj Kumar' })).toHaveAttribute(
      'href', 'mailto:dheeraj.2.kumar@outlook.com',
    )
  })
  it('offers a real contact address and playful copy without promising a response time', () => {
    render(<ContactPage />)
    expect(screen.getByRole('link', { name: 'dheeraj.2.kumar@outlook.com' })).toHaveAttribute(
      'href', 'mailto:dheeraj.2.kumar@outlook.com',
    )
    expect(screen.getByText(/before lunch/)).toBeInTheDocument()
    expect(screen.getByText(/no promised response time/)).toBeInTheDocument()
  })
})
