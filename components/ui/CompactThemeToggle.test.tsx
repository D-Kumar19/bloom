import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AppearanceProvider } from '@/components/ui/AppearanceProvider'
import { CompactThemeToggle } from '@/components/ui/CompactThemeToggle'

describe('CompactThemeToggle', () => {
  it('toggles between light and dark', () => {
    localStorage.clear()

    render(
      <AppearanceProvider>
        <CompactThemeToggle />
      </AppearanceProvider>,
    )

    fireEvent.click(screen.getByTestId('theme-toggle'))
    expect(localStorage.getItem('bloom-appearance')).toBe('light')

    fireEvent.click(screen.getByTestId('theme-toggle'))
    expect(localStorage.getItem('bloom-appearance')).toBe('dark')
  })
})
