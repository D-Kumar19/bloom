import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Button } from '@/components/ui/Button'

describe('polished button consistency', () => {
  it('keeps rounded touch-sized controls and a shared contrast-safe action color', () => {
    render(<Button disabled>Continue</Button>)
    const button = screen.getByRole('button', { name: 'Continue' })
    expect(button).toHaveClass('rounded-2xl', 'min-h-11', 'bg-action-rose')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('type', 'button')
  })

  it('preserves link behavior and the existing pill-shaped homepage override', () => {
    render(<Button href="/create" className="rounded-full">Create your bouquet</Button>)
    expect(screen.getByRole('link', { name: 'Create your bouquet' })).toHaveAttribute('href', '/create')
    expect(screen.getByRole('link', { name: 'Create your bouquet' })).toHaveClass('rounded-full')
  })
})
