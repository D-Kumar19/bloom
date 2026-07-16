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

  it('keeps hearts and leaves on separate slots for cherry blossom', () => {
    render(<ThemeDecorations decorations={['hearts', 'leaves']} density="scene" />)

    const hearts = screen.getAllByTestId('theme-decoration-hearts')
    const leaves = screen.getAllByTestId('theme-decoration-leaves')
    const positions = new Set(
      [...hearts, ...leaves].map((element) => `${element.style.left}|${element.style.top}`),
    )

    expect(hearts.length).toBe(4)
    expect(leaves.length).toBe(4)
    expect(positions.size).toBe(8)
  })
})
