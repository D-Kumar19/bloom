import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Footer } from '@/components/ui/Footer'
import PrivacyPage from '@/app/privacy/page'
import ContactPage from '@/app/contact/page'
import AboutPage from '@/app/about/page'
import ExplorePage from '@/app/explore/page'

vi.mock('@/lib/counter', () => ({ getBouquetCount: vi.fn().mockResolvedValue(null) }))
vi.mock('next/server', () => ({ connection: vi.fn().mockResolvedValue(undefined) }))
describe('honest navigation and privacy', () => {
  it('links each discovery destination to its own page and starts new bouquets explicitly', async () => {
    render(await Footer())
    expect(screen.getAllByRole('heading', { name: 'About & help' })).toHaveLength(2)
    expect(screen.queryByText('Small print')).not.toBeInTheDocument()
    for (const [label, href] of [
      ['About Bloom', '/about'],
      ['Privacy & gift links', '/privacy'],
      ['Contact & feedback', '/contact'],
    ]) {
      const links = screen.getAllByRole('link', { name: label })
      expect(links).toHaveLength(2)
      for (const link of links) expect(link).toHaveAttribute('href', href)
    }
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
    expect(screen.getByRole('heading', { name: 'The short version' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Who can read my gift?' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'What happens to my draft?' })).toBeInTheDocument()
    expect(screen.getByText(/Keep my draft leaves it unchanged/)).toBeInTheDocument()
    expect(screen.getByText(/Compression is not encryption/)).toBeInTheDocument()
    expect(screen.getByText(/query parameter sent/)).toBeInTheDocument()
    expect(screen.getByText(/Expired drafts are/)).toBeInTheDocument()
    expect(screen.getByText(/does not prove/)).toBeInTheDocument()
    expect(screen.getByText(/permanent counted-ID marker/)).toBeInTheDocument()
    expect(screen.getByText(/10 valid counting requests/)).toBeInTheDocument()
    expect(screen.getByText(/precautions, not access controls/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dheeraj Kumar' })).toHaveAttribute(
      'href', 'mailto:dheeraj.2.kumar@outlook.com',
    )
  })
  it('explains digital gifting and offers safe next steps instead of implying physical delivery', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { name: 'A small gift, in three parts' })).toBeInTheDocument()
    expect(screen.getByText(/There is no physical delivery/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Create a bouquet' })).toHaveAttribute('href', '/create?new=1')
    expect(screen.getByRole('link', { name: 'Find a template' })).toHaveAttribute('href', '/templates')
    expect(screen.getByRole('link', { name: 'Understand gift-link privacy' })).toHaveAttribute('href', '/privacy')
  })
  it('offers a real contact address and playful copy without promising a response time', () => {
    render(<ContactPage />)
    expect(screen.getByRole('link', { name: 'dheeraj.2.kumar@outlook.com' })).toHaveAttribute(
      'href', 'mailto:dheeraj.2.kumar@outlook.com',
    )
    expect(screen.getByText(/before lunch/)).toBeInTheDocument()
    expect(screen.getByText(/no promised response time/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Something not working?' })).toBeInTheDocument()
    expect(screen.getByText(/What you tried, what you expected/)).toBeInTheDocument()
    expect(screen.getByText(/hide names, notes, and gift URLs/)).toBeInTheDocument()
  })
})
