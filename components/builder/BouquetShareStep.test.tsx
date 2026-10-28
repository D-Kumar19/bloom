import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { BouquetShareStep } from '@/components/builder/BouquetShareStep'
import { DEFAULT_BOUQUET_ID } from '@/lib/bouquets'
import { recordBouquetSentOnce } from '@/lib/counter/recordBouquetSent'

vi.mock('@/lib/counter/recordBouquetSent', () => ({
  recordBouquetSentOnce: vi.fn(() => new Promise<void>(() => {})),
}))

vi.mock('@/components/bouquet/SoundtrackPlayer', () => ({
  SoundtrackPlayer: () => <div data-testid="soundtrack-inline" />,
}))

vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}))

const baseState = {
  bouquetId: DEFAULT_BOUQUET_ID,
  cardStyle: 'classic-cream',
  to: 'Alex',
  message: 'Thinking of you',
  from: 'Sam',
  theme: 'cherry',
  soundtrack: 'rain',
}

describe('BouquetShareStep', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'share')
  })

  it('renders the themed recipient preview backdrop and soundtrack player', () => {
    render(<BouquetShareStep state={baseState} onCreateAnother={vi.fn()} />)

    expect(screen.getByTestId('share-reveal-backdrop')).toBeInTheDocument()
    expect(screen.getByTestId('bouquet-hero')).toBeInTheDocument()
    expect(screen.getByTestId('soundtrack-inline')).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: 'Happy with your gift? Jump to sharing',
      })
    ).toHaveAttribute('href', '#share-actions')
    expect(
      screen.getByRole('region', { name: 'Share your bouquet' })
    ).toHaveAttribute('id', 'share-actions')
    expect(
      screen.getByRole('link', { name: 'preview as recipient' })
    ).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/bouquet\?b=.+&preview=1$/)
    )
  })

  it('shows one primary action and tucks the alternatives away', async () => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: vi.fn(),
    })
    render(<BouquetShareStep state={baseState} onCreateAnother={vi.fn()} />)

    expect(
      await screen.findByRole('button', { name: 'Share bouquet' })
    ).toBeInTheDocument()
    expect(screen.queryByTestId('copy-share-button')).not.toBeInTheDocument()
    expect(screen.queryByTestId('copy-link-button')).not.toBeInTheDocument()

    const toggle = screen.getByTestId('more-share-options-toggle')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByTestId('copy-share-button')).toBeInTheDocument()
    expect(screen.getByTestId('copy-link-button')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /copy manually/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('textbox', { name: 'Full bouquet link' })
    ).not.toBeInTheDocument()
  })

  it('confirms both clipboard actions without waiting on a stalled counter', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    render(<BouquetShareStep state={baseState} onCreateAnother={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy message + link' }))
    await waitFor(() =>
      expect(screen.getByTestId('copy-share-button')).toHaveTextContent(
        'Copied!'
      )
    )
    expect(screen.getByTestId('copy-share-button')).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: /More ways to share/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Copy link only' }))
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(2))
    expect(recordBouquetSentOnce).toHaveBeenCalledTimes(2)
  })

  it('does not count viewing a preview or a failed clipboard write', async () => {
    vi.mocked(recordBouquetSentOnce).mockClear()
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockRejectedValue(new Error('Clipboard blocked')),
      },
    })
    render(<BouquetShareStep state={baseState} onCreateAnother={vi.fn()} />)
    expect(recordBouquetSentOnce).not.toHaveBeenCalled()
    fireEvent.click(screen.getByTestId('more-share-options-toggle'))
    fireEvent.click(screen.getByTestId('copy-link-button'))
    await waitFor(() =>
      expect(screen.getByTestId('copy-link-button')).toBeEnabled()
    )
    expect(recordBouquetSentOnce).not.toHaveBeenCalled()
    expect(
      screen.getByRole<HTMLTextAreaElement>('textbox', {
        name: 'Full bouquet link',
      }).value
    ).toContain('/bouquet?b=')
  })

  it('counts a completed native share once, like a copy', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share,
    })
    vi.mocked(recordBouquetSentOnce).mockClear()
    render(<BouquetShareStep state={baseState} onCreateAnother={vi.fn()} />)

    const shareButton = await screen.findByRole('button', {
      name: 'Share bouquet',
    })
    fireEvent.click(shareButton)

    await waitFor(() =>
      expect(share).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'A bouquet for you',
          url: expect.stringMatching(/\/bouquet\?b=/),
        })
      )
    )
    await waitFor(() =>
      expect(recordBouquetSentOnce).toHaveBeenCalledTimes(1)
    )
  })

  it('counts copying the fallback link, but not merely revealing it', async () => {
    vi.mocked(recordBouquetSentOnce).mockClear()
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockRejectedValue(new Error('Clipboard blocked')),
      },
    })
    render(<BouquetShareStep state={baseState} onCreateAnother={vi.fn()} />)
    fireEvent.click(screen.getByTestId('more-share-options-toggle'))
    fireEvent.click(screen.getByTestId('copy-link-button'))
    const link = await screen.findByRole('textbox', {
      name: 'Full bouquet link',
    })
    fireEvent.focus(link)
    expect(recordBouquetSentOnce).not.toHaveBeenCalled()
    fireEvent.copy(link)
    expect(recordBouquetSentOnce).toHaveBeenCalledTimes(1)
  })

  it('opens the selectable link fallback when native sharing fails', async () => {
    vi.mocked(recordBouquetSentOnce).mockClear()
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: vi.fn().mockRejectedValue(new Error('Share unavailable')),
    })
    render(<BouquetShareStep state={baseState} onCreateAnother={vi.fn()} />)
    fireEvent.click(
      await screen.findByRole('button', { name: 'Share bouquet' })
    )

    const link = await screen.findByRole<HTMLTextAreaElement>('textbox', {
      name: 'Full bouquet link',
    })
    expect(link.value).toContain('/bouquet?b=')
    expect(link).toHaveAttribute('readonly')
    expect(recordBouquetSentOnce).not.toHaveBeenCalled()
    fireEvent.focus(link)
    fireEvent.click(screen.getByRole('button', { name: 'Select link' }))
    expect(link).toHaveFocus()
    expect(link.selectionStart).toBe(0)
    expect(link.selectionEnd).toBe(link.value.length)
  })

  it('does not treat a cancelled share sheet as an error', async () => {
    vi.mocked(recordBouquetSentOnce).mockClear()
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: vi
        .fn()
        .mockRejectedValue(new DOMException('Share cancelled', 'AbortError')),
    })
    render(<BouquetShareStep state={baseState} onCreateAnother={vi.fn()} />)
    fireEvent.click(
      await screen.findByRole('button', { name: 'Share bouquet' })
    )

    await waitFor(() =>
      expect(screen.getByTestId('native-share-button')).toBeInTheDocument()
    )
    expect(
      screen.queryByRole('textbox', { name: 'Full bouquet link' })
    ).not.toBeInTheDocument()
    expect(recordBouquetSentOnce).not.toHaveBeenCalled()
  })

  it('shows a decorative, non-blocking ready moment', () => {
    render(<BouquetShareStep state={baseState} onCreateAnother={vi.fn()} />)
    const bloom = screen.getByTestId('ready-bloom')
    expect(bloom).toHaveAttribute('aria-hidden', 'true')
    expect(bloom).toHaveClass('pointer-events-none')
    expect(screen.getByRole('heading', { name: 'Preview and share' })).toBeInTheDocument()
  })

  it('offers email compose links that count the gift once', () => {
    vi.mocked(recordBouquetSentOnce).mockClear()
    render(<BouquetShareStep state={baseState} onCreateAnother={vi.fn()} />)
    expect(screen.queryByTestId('email-share-link')).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId('more-share-options-toggle'))

    const email = screen.getByRole('link', { name: 'Send by email' })
    expect(email.getAttribute('href')).toMatch(/^mailto:\?subject=A%20bouquet%20from%20Sam&body=/)
    const gmail = screen.getByRole('link', { name: 'Gmail' })
    const outlook = screen.getByRole('link', { name: 'Outlook' })
    for (const link of [gmail, outlook]) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link.getAttribute('href')).toContain('bouquet%3Fb%3D')
    }
    expect(screen.queryByTestId('email-long-link-hint')).not.toBeInTheDocument()

    const stopNavigation = (event: Event) => event.preventDefault()
    document.addEventListener('click', stopNavigation)
    fireEvent.click(email)
    fireEvent.click(gmail)
    document.removeEventListener('click', stopNavigation)
    expect(recordBouquetSentOnce).toHaveBeenCalledTimes(2)
    expect(recordBouquetSentOnce).toHaveBeenCalledWith(baseState)
  })

  it('suggests copying the link when an email link may be too long', () => {
    const message = Array.from({ length: 200 }, (_, i) => `${(i * 7919).toString(36)}q${i}`).join(' ')
    render(
      <BouquetShareStep state={{ ...baseState, message }} onCreateAnother={vi.fn()} />
    )
    fireEvent.click(screen.getByTestId('more-share-options-toggle'))
    expect(screen.getByTestId('email-long-link-hint')).toHaveTextContent('Copy link only')
  })
})
