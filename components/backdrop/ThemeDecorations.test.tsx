import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ThemeDecorations } from '@/components/backdrop/ThemeDecorations'

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false,
}))

describe('ThemeDecorations', () => {
  it('renders hearts for romantic themes', () => {
    render(<ThemeDecorations decorations={['hearts']} density="scene" />)

    expect(screen.getByTestId('theme-decorations')).toBeInTheDocument()
    expect(screen.getAllByTestId('theme-decoration-hearts').length).toBeGreaterThan(0)
  })

  it('renders birds and clouds for ocean', () => {
    render(<ThemeDecorations decorations={['clouds', 'birds']} density="scene" />)

    expect(screen.getAllByTestId('theme-decoration-clouds').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('theme-decoration-birds').length).toBeGreaterThan(0)
  })
})
