import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import CreatePage from '@/app/create/page'
import { SiteChrome } from '@/components/layout/SiteChrome'
import { AppearanceProvider } from '@/components/ui/AppearanceProvider'
import { ToastProvider } from '@/components/ui/Toast'
import { DEFAULT_BOUQUET_ID } from '@/lib/bouquets'

const push = vi.fn()
const mockUseBouquetState = vi.fn()
const motion = vi.hoisted(() => ({ reduced: false }))

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => motion.reduced,
}))

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
    ready: true,
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
    maxMessageWords: 200,
    pendingStarter: null,
    keepDraft: vi.fn(),
    startWithStarter: vi.fn(),
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
    </AppearanceProvider>
  )
}

describe('CreatePage transitions', () => {
  beforeEach(() => {
    push.mockReset()
    mockUseBouquetState.mockReset()
    motion.reduced = false
  })

  it('attaches the progress bar to the site header', () => {
    mockUseBouquetState.mockReturnValue(buildState('bouquet'))

    renderCreatePage()

    expect(screen.getByTestId('header-slot')).toBeInTheDocument()
    expect(screen.getByTestId('progress-shell')).toBeInTheDocument()
    expect(
      screen.queryByTestId('progress-shell-fallback')
    ).not.toBeInTheDocument()
  })

  it('shows a persistent warning when draft storage is unavailable', () => {
    mockUseBouquetState.mockReturnValue({
      ...buildState('bouquet'),
      storageError: 'Draft recovery is unavailable in this browser.',
    })
    renderCreatePage()
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Draft recovery is unavailable'
    )
    expect(screen.getByTestId('next-button')).toBeEnabled()
  })

  it('asks before replacing a saved draft with an occasion starter', () => {
    const state = {
      ...buildState('card'),
      pendingStarter: {
        title: 'Celebrate the day they arrived',
      },
    }
    mockUseBouquetState.mockReturnValue(state)

    renderCreatePage()

    expect(screen.getByRole('dialog', { name: 'Keep your saved bouquet?' })).toHaveTextContent(
      'Your saved bouquet will only be replaced if you choose to start with this idea.'
    )
    fireEvent.click(screen.getByRole('button', { name: 'Keep my draft' }))
    expect(state.keepDraft).toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Start with this idea' }))
    expect(state.startWithStarter).toHaveBeenCalled()
  })

  it('falls back to a sticky progress shell without site chrome', () => {
    mockUseBouquetState.mockReturnValue(buildState('bouquet'))

    renderCreatePage(false)

    expect(screen.getByTestId('progress-shell-fallback')).toHaveClass('sticky')
  })

  it('explains that New bouquet starts at flowers only after explicit confirmation', () => {
    const state = {
      ...buildState('message'),
      pendingStarter: { fresh: true, title: 'a new bouquet' },
    }
    mockUseBouquetState.mockReturnValue(state)
    renderCreatePage()
    const dialog = screen.getByRole('dialog', { name: 'Start a new bouquet?' })
    expect(dialog).toHaveTextContent('starting at flower selection')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Start new bouquet' }))
    expect(state.startWithStarter).toHaveBeenCalledOnce()
  })

  it('shows a failed replacement warning inside the dialog with retry and keep actions', () => {
    const state = {
      ...buildState('card'),
      pendingStarter: { title: 'Celebrate the day they arrived' },
      storageError: 'Could not save this starter. Your saved bouquet is unchanged. Try again or keep your draft.',
    }
    mockUseBouquetState.mockReturnValue(state)
    renderCreatePage()

    const dialog = screen.getByRole('dialog', { name: 'Keep your saved bouquet?' })
    expect(within(dialog).getByRole('alert')).toHaveTextContent(state.storageError)
    expect(screen.getAllByRole('alert')).toHaveLength(1)
    fireEvent.click(within(dialog).getByRole('button', { name: 'Start with this idea' }))
    expect(state.startWithStarter).toHaveBeenCalledOnce()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Keep my draft' }))
    expect(state.keepDraft).toHaveBeenCalledOnce()
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
    expect(screen.getByTestId('step-panel')).toHaveClass('min-w-0')
  })

  it('changes steps without animated scrolling when reduced motion is preferred', () => {
    motion.reduced = true
    const scrollTo = vi.fn()
    Object.defineProperty(window, 'scrollTo', { value: scrollTo, writable: true })
    mockUseBouquetState.mockReturnValue(buildState('bouquet'))
    const { rerender } = renderCreatePage(false)
    mockUseBouquetState.mockReturnValue(buildState('card'))
    rerender(
      <AppearanceProvider>
        <ToastProvider><CreatePage /></ToastProvider>
      </AppearanceProvider>
    )
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
    expect(screen.getByTestId('step-panel')).not.toHaveClass('animate-step-enter')
  })

  it('advances when continue is clicked', () => {
    const state = buildState('bouquet')
    mockUseBouquetState.mockReturnValue(state)

    renderCreatePage()
    fireEvent.click(screen.getByTestId('next-button'))

    expect(state.goNext).toHaveBeenCalled()
  })
})
