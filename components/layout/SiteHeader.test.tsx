import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { AppearanceProvider } from '@/components/ui/AppearanceProvider'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('SiteHeader', () => {
  it('renders logo, theme toggle, and create CTA', () => {
    render(
      <AppearanceProvider>
        <SiteHeader />
      </AppearanceProvider>,
    )

    expect(screen.getByTestId('site-logo')).toBeInTheDocument()
    expect(screen.getByText('Create Bouquet')).toBeInTheDocument()
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
  })

  it('toggles theme from the header control', () => {
    localStorage.clear()

    render(
      <AppearanceProvider>
        <SiteHeader />
      </AppearanceProvider>,
    )

    fireEvent.click(screen.getByTestId('theme-toggle'))
    expect(localStorage.getItem('bloom-appearance')).toBe('light')
  })
})
