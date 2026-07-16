import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Modal } from '@/components/ui/Modal'

describe('Modal', () => {
  it('renders a scrollable overlay for tall mobile content', () => {
    render(
      <Modal open onClose={vi.fn()} title="Theme details">
        <p>Long modal body</p>
      </Modal>,
    )

    const overlay = screen.getByRole('dialog').parentElement?.parentElement
    expect(overlay).toHaveClass('overflow-y-auto')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Long modal body')).toBeInTheDocument()
  })
})
