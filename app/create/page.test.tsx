import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import CreatePage from '@/app/create/page'
import { ToastProvider } from '@/components/ui/Toast'

const push = vi.fn()
const mockUseBouquetState = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
  }),
}))

vi.mock('@/hooks/useBouquetState', () => ({
  useBouquetState: () => mockUseBouquetState(),
}))

function buildState(step: 'pick' | 'greenery' | 'card' | 'message' | 'theme') {
  return {
    state: {
      flowers: ['rose', 'peony', 'tulip'],
      greenery: 'leafy',
      cardStyle: 'classic-cream',
      to: '',
      message: '',
      from: '',
      theme: 'warm',
    },
    step,
    onAdjustFlowerQuantity: vi.fn(),
    setGreenery: vi.fn(),
    setCardStyle: vi.fn(),
    setPhotoCardImage: vi.fn(),
    setTo: vi.fn(),
    setMessage: vi.fn(),
    setFrom: vi.fn(),
    setTheme: vi.fn(),
    canProceed: true,
    goNext: vi.fn(),
    goBack: vi.fn(),
    maxMessageLength: 200,
  }
}

function renderCreatePage() {
  return render(
    <ToastProvider>
      <CreatePage />
    </ToastProvider>
  )
}

describe('CreatePage transitions', () => {
  beforeEach(() => {
    push.mockReset()
    mockUseBouquetState.mockReset()
  })

  it('keeps the progress bar in a sticky container', () => {
    mockUseBouquetState.mockReturnValue(buildState('pick'))

    renderCreatePage()

    expect(screen.getByTestId('progress-shell')).toHaveClass('sticky')
  })

  it('smooth-scrolls to the top when the step changes', () => {
    const scrollTo = vi.fn()
    Object.defineProperty(window, 'scrollTo', {
      value: scrollTo,
      writable: true,
    })

    mockUseBouquetState.mockReturnValue(buildState('pick'))
    const { rerender } = renderCreatePage()

    mockUseBouquetState.mockReturnValue(buildState('greenery'))
    rerender(
      <ToastProvider>
        <CreatePage />
      </ToastProvider>
    )

    expect(scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    })
  })

  it('animates the visible step panel', () => {
    mockUseBouquetState.mockReturnValue(buildState('greenery'))

    renderCreatePage()

    expect(screen.getByTestId('step-panel')).toHaveClass('animate-step-enter')
  })

  it('advances when continue is clicked', () => {
    const state = buildState('pick')
    mockUseBouquetState.mockReturnValue(state)

    renderCreatePage()
    fireEvent.click(screen.getByTestId('next-button'))

    expect(state.goNext).toHaveBeenCalled()
  })
})
