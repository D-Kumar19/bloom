import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import ExplorePage from '@/app/explore/page'
import { GUIDES } from '@/lib/guides'
import TemplatesPage from '@/app/templates/page'

describe('Explore templates', () => {
  it('offers editable starters from the existing guide collection', () => {
    render(<TemplatesPage />)

    const templates = screen.getByRole('main')
    const links = within(templates).getAllByRole('link', { name: 'Start with this idea' })

    expect(links).toHaveLength(GUIDES.length)
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      GUIDES.map((guide) => `/create?starter=${guide.slug}`)
    )
    expect(within(templates).getByText(/you can change the flowers or style at any time/i))
      .toBeInTheDocument()
    for (const link of links) expect(link).toHaveClass('bloom-magic-action')
  })

  it('preserves old Explore anchors while linking to the dedicated pages', () => {
    render(<ExplorePage />)
    for (const id of ['flowers', 'note-styles', 'backdrops', 'ambient-sound', 'templates']) {
      const section = document.getElementById(id)
      expect(section).not.toBeNull()
      expect(section?.querySelector('a')).toHaveAttribute('href', `/${id}`)
    }
  })
})
