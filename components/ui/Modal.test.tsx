import { fireEvent, render, screen } from '@testing-library/react'
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

  it('focuses inside, traps both directions, makes background inert, and restores focus and scroll', () => {
    const opener = document.createElement('button')
    document.body.appendChild(opener)
    opener.focus()
    const onClose = vi.fn()
    const { unmount } = render(
      <Modal open onClose={onClose} title="Focus test"><button>Last action</button></Modal>,
    )
    const close = screen.getByRole('button', { name: 'Close modal' })
    const last = screen.getByRole('button', { name: 'Last action' })
    expect(close).toHaveFocus()
    expect(opener.inert).toBe(true)
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.keyDown(close, { key: 'Tab', shiftKey: true })
    expect(last).toHaveFocus()
    fireEvent.keyDown(last, { key: 'Tab' })
    expect(close).toHaveFocus()
    fireEvent.keyDown(close, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
    unmount()
    expect(opener.inert).toBeFalsy()
    expect(opener).toHaveFocus()
    expect(document.body.style.overflow).not.toBe('hidden')
    opener.remove()
  })

  it('does not steal focus back when the parent changes its close callback', () => {
    const { rerender } = render(
      <Modal open onClose={vi.fn()} title="Stable focus"><button>Keep focus</button></Modal>,
    )
    const control = screen.getByRole('button', { name: 'Keep focus' })
    control.focus()
    const close = vi.fn()
    rerender(<Modal open onClose={close} title="Stable focus"><button>Keep focus</button></Modal>)
    expect(control).toHaveFocus()
    fireEvent.keyDown(control, { key: 'Escape' })
    expect(close).toHaveBeenCalled()
  })
})
