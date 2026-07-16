import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BackdropLayer } from '@/components/backdrop/BackdropLayer'

describe('BackdropLayer', () => {
  it('renders layered backdrop for a known theme', () => {
    render(<BackdropLayer theme="ocean" className="h-32 w-full" />)

    expect(screen.getByTestId('backdrop-layer-ocean')).toBeInTheDocument()
    expect(screen.getByTestId('backdrop-layer-ocean')).toHaveAttribute(
      'data-backdrop-variant',
      'full',
    )
  })

  it('renders preview variant with mini bouquet silhouette', () => {
    render(
      <BackdropLayer
        theme="warm"
        variant="preview"
        showMiniBouquet
        className="h-32 w-full"
      />,
    )

    const layer = screen.getByTestId('backdrop-layer-warm')
    expect(layer).toHaveAttribute('data-backdrop-variant', 'preview')
  })

  it('renders cherry blossom petals', () => {
    const { container } = render(
      <BackdropLayer theme="cherry" className="h-32 w-full" />,
    )

    expect(container.querySelector('svg')).toBeTruthy()
  })
})
