import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ToastProvider, useToast } from '@/components/ui/Toast'

function Feedback({ type }: { type: 'info' | 'success' | 'warning' }) {
  const { showToast } = useToast()
  return <button onClick={() => showToast('Gift feedback', type)}>Show feedback</button>
}

describe('readable toast feedback', () => {
  afterEach(() => vi.useRealTimers())

  it.each([
    ['success', 'bg-green-800', 'text-white'],
    ['warning', 'bg-amber-100', 'text-amber-950'],
    ['info', 'bg-surface', 'text-bloom-ink'],
  ] as const)('preserves %s status and dismissal with readable paired colors', (type, background, text) => {
    vi.useFakeTimers()
    render(<ToastProvider><Feedback type={type} /></ToastProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'Show feedback' }))
    expect(screen.getByRole('status')).toHaveClass(background, text, 'rounded-2xl')
    expect(screen.getByRole('status')).toHaveTextContent('Gift feedback')
    act(() => vi.advanceTimersByTime(3000))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
