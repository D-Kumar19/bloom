import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import ExplorePage from '@/app/explore/page'
import { GUIDES } from '@/lib/guides'

describe('Explore templates', () => {
  it('offers editable starters from the existing guide collection', () => {
    render(<ExplorePage />)

    const templates = screen.getByRole('heading', { name: 'Templates' }).closest('section')
    expect(templates).not.toBeNull()
    const links = within(templates!).getAllByRole('link', { name: 'Start with this idea' })

    expect(links).toHaveLength(GUIDES.length)
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      GUIDES.map((guide) => `/create?starter=${guide.slug}`)
    )
    expect(within(templates!).getByText(/you can change the flowers or style at any time/i))
      .toBeInTheDocument()
  })
})
