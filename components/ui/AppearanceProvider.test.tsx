import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AppearanceProvider } from '@/components/ui/AppearanceProvider'
import { CompactThemeToggle } from '@/components/ui/CompactThemeToggle'
import { APPEARANCE_STORAGE_KEY } from '@/lib/appearance'

describe('AppearanceProvider', () => {
  it('defaults to dark mode and syncs the document on mount', async () => {
    localStorage.clear()

    render(
      <AppearanceProvider>
        <CompactThemeToggle />
      </AppearanceProvider>,
    )

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument()
    expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBeNull()
  })

  it('reapplies stored light mode to the document on mount', async () => {
    localStorage.setItem(APPEARANCE_STORAGE_KEY, 'light')

    render(
      <AppearanceProvider>
        <CompactThemeToggle />
      </AppearanceProvider>,
    )

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument()
  })
})
