import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import CreatePage from '@/app/create/page'
import { SiteChrome } from '@/components/layout/SiteChrome'
import { AppearanceProvider } from '@/components/ui/AppearanceProvider'
import { ToastProvider } from '@/components/ui/Toast'
import { DEFAULT_BOUQUET_ID } from '@/lib/bouquets'

const push = vi.fn()
const mockUseBouquetState = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
  }),
  usePathname: () => '/create',
}))

vi.mock('@/hooks/useBouquetState', () => ({
  useBouquetState: () => mockUseBouquetState(),
}))

function buildState(step: 'bouquet' | 'card' | 'message' | 'theme') {
  return {
    state: {
      bouquetId: DEFAULT_BOUQUET_ID,
      cardStyle: 'classic-cream',
      to: '',
      message: '',
      from: '',
      theme: 'warm',
      soundtrack: 'none',
    },
    step,
    setBouquet: vi.fn(),
    setCardStyle: vi.fn(),
    setMessageFormat: vi.fn(),
    setNoteBorder: vi.fn(),
    setTo: vi.fn(),
    setMessage: vi.fn(),
    setFrom: vi.fn(),
    setTheme: vi.fn(),
    setSoundtrack: vi.fn(),
    canProceed: true,
    goNext: vi.fn(),
    goBack: vi.fn(),
    goToStep: vi.fn(),
    startNewBouquet: vi.fn(),
    maxMessageLength: 200,
  }
}

function renderCreatePage(withChrome = true) {
  const page = (
    <ToastProvider>
      <CreatePage />
    </ToastProvider>
  )

  return render(
    <AppearanceProvider>
      {withChrome ? <SiteChrome>{page}</SiteChrome> : page}
    </AppearanceProvider>,
  )
}

describe('CreatePage transitions', () => {
  beforeEach(() => {
    push.mockReset()
    mockUseBouquetState.mockReset()
  })

  it('attaches the progress bar to the site header', () => {
    mockUseBouquetState.mockReturnValue(buildState('bouquet'))

    renderCreatePage()

    expect(screen.getByTestId('header-slot')).toBeInTheDocument()
    expect(screen.getByTestId('progress-shell')).toBeInTheDocument()
    expect(screen.queryByTestId('progress-shell-fallback')).not.toBeInTheDocument()
  })

  it('falls back to a sticky progress shell without site chrome', () => {
    mockUseBouquetState.mockReturnValue(buildState('bouquet'))

    renderCreatePage(false)

    expect(screen.getByTestId('progress-shell-fallback')).toHaveClass('sticky')
  })

  it('smooth-scrolls to the top when the step changes', () => {
    const scrollTo = vi.fn()
    Object.defineProperty(window, 'scrollTo', {
      value: scrollTo,
      writable: true,
    })

    mockUseBouquetState.mockReturnValue(buildState('bouquet'))
    const { rerender } = renderCreatePage()

    mockUseBouquetState.mockReturnValue(buildState('card'))
    rerender(
      <AppearanceProvider>
        <SiteChrome>
          <ToastProvider>
            <CreatePage />
          </ToastProvider>
        </SiteChrome>
      </AppearanceProvider>
    )

    expect(scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    })
  })

  it('animates the visible step panel', () => {
    mockUseBouquetState.mockReturnValue(buildState('card'))

    renderCreatePage()

    expect(screen.getByTestId('step-panel')).toHaveClass('animate-step-enter')
  })

  it('advances when continue is clicked', () => {
    const state = buildState('bouquet')
    mockUseBouquetState.mockReturnValue(state)

    renderCreatePage()
    fireEvent.click(screen.getByTestId('next-button'))

    expect(state.goNext).toHaveBeenCalled()
  })
})
