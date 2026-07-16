import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FooterBrand } from '@/components/ui/FooterBrand'
import { AppearanceProvider } from '@/components/ui/AppearanceProvider'

describe('FooterBrand', () => {
  it('renders logo and bouquet counter', () => {
    render(
      <AppearanceProvider>
        <FooterBrand initialCount={12} />
      </AppearanceProvider>,
    )

    expect(screen.getByTestId('site-logo')).toBeInTheDocument()
    expect(screen.getByText(/bouquets sent so far/)).toBeInTheDocument()
    expect(screen.queryByTestId('theme-toggle')).not.toBeInTheDocument()
  })
})
