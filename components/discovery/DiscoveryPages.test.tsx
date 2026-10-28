import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import FlowersPage from '@/app/flowers/page'
import NoteStylesPage from '@/app/note-styles/page'
import BackdropsPage from '@/app/backdrops/page'
import AmbientSoundPage from '@/app/ambient-sound/page'
import { BOUQUETS } from '@/lib/bouquets'
import { CARD_STYLES } from '@/lib/cards'
import { THEMES } from '@/lib/themes'

const audio = vi.hoisted(() => ({ play: vi.fn(), stop: vi.fn(), isPlaying: vi.fn(() => false), error: null as string | null }))
vi.mock('@/hooks/useAmbientSoundtrack', () => ({ useAmbientSoundtrack: () => audio }))

describe('distinct discovery destinations', () => {
  it('shows the real flower catalog and a separate templates invitation', () => {
    render(<FlowersPage />)
    for (const bouquet of BOUQUETS) {
      expect(screen.getByRole('heading', { name: bouquet.name })).toBeInTheDocument()
      expect(screen.getByAltText(bouquet.tagline)).toBeInTheDocument()
      expect(screen.getByText(bouquet.description)).toBeInTheDocument()
    }
    expect(screen.getByText(/no universal flower rulebook/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Explore templates' })).toHaveAttribute('href', '/templates')
    expect(screen.getByRole('link', { name: 'Start a new bouquet' })).toHaveAttribute('href', '/create?new=1')
  })

  it('shows actual note-style previews, not flower or backdrop copy', () => {
    render(<NoteStylesPage />)
    for (const card of CARD_STYLES) expect(screen.getByRole('heading', { name: card.name })).toBeInTheDocument()
    expect(screen.getAllByTestId('message-card')).toHaveLength(CARD_STYLES.length)
    expect(screen.getByText(/up to 200 words/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Explore templates' })).toBeInTheDocument()
  })

  it('shows actual backdrop previews and motion descriptions', () => {
    render(<BackdropsPage />)
    for (const theme of THEMES) {
      expect(screen.getByRole('heading', { name: theme.name })).toBeInTheDocument()
      expect(screen.getByText(theme.description)).toBeInTheDocument()
    }
    expect(screen.getByText(/reduced-motion preference/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Explore templates' })).toBeInTheDocument()
  })

  it('never autoplays audio and exposes listening, stop, and retryable failures', () => {
    audio.play.mockClear()
    audio.stop.mockClear()
    audio.error = null
    const { rerender } = render(<AmbientSoundPage />)
    expect(audio.play).not.toHaveBeenCalled()
    expect(screen.getByText(/nothing plays automatically/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Listen to Soft rain' }))
    expect(audio.play).toHaveBeenCalledWith('rain')
    fireEvent.click(screen.getByRole('button', { name: 'Stop sound' }))
    expect(audio.stop).toHaveBeenCalled()
    audio.error = 'Sound could not play. Tap to retry, or choose silence.'
    rerender(<AmbientSoundPage />)
    expect(screen.getByRole('alert')).toHaveTextContent(audio.error)
    expect(within(screen.getByRole('main')).getByRole('link', { name: 'Explore templates' })).toBeInTheDocument()
    audio.error = null
  })
})
