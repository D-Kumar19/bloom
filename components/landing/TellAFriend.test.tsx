import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TellAFriend } from '@/components/landing/TellAFriend'
import { recordBouquetSentOnce } from '@/lib/counter/recordBouquetSent'
import { SITE_SHARE_TEXT } from '@/lib/sharing'

const showToast = vi.fn()

vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({ showToast }),
}))

vi.mock('@/lib/counter/recordBouquetSent', () => ({
  recordBouquetSentOnce: vi.fn(),
}))

function setClipboard(writeText: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
}

describe('TellAFriend', () => {
  beforeEach(() => {
    showToast.mockClear()
  })

  afterEach(() => {
    Reflect.deleteProperty(navigator, 'share')
  })

  it('opens the native share sheet with the site address', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', { configurable: true, value: share })
    render(<TellAFriend />)

    fireEvent.click(screen.getByRole('button', { name: /Tell a friend about Bloom/ }))

    await waitFor(() =>
      expect(share).toHaveBeenCalledWith({
        title: 'Bloom',
        text: SITE_SHARE_TEXT,
        url: window.location.origin,
      })
    )
    expect(recordBouquetSentOnce).not.toHaveBeenCalled()
  })

  it('stays quiet when the share sheet is cancelled', async () => {
    const writeText = vi.fn()
    setClipboard(writeText)
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: vi.fn().mockRejectedValue(new DOMException('cancelled', 'AbortError')),
    })
    render(<TellAFriend />)

    fireEvent.click(screen.getByTestId('tell-a-friend'))

    await waitFor(() => expect(navigator.share).toHaveBeenCalled())
    expect(writeText).not.toHaveBeenCalled()
    expect(showToast).not.toHaveBeenCalled()
  })

  it('copies the message when sharing is unavailable', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    setClipboard(writeText)
    render(<TellAFriend />)

    fireEvent.click(screen.getByTestId('tell-a-friend'))

    await waitFor(() => expect(screen.getByTestId('tell-a-friend')).toHaveTextContent('Copied!'))
    expect(writeText).toHaveBeenCalledWith(`${SITE_SHARE_TEXT}\n${window.location.origin}`)
    expect(showToast).toHaveBeenCalledWith(expect.stringContaining('Copied'), 'success')
    expect(recordBouquetSentOnce).not.toHaveBeenCalled()
  })

  it('shows the address when copying fails', async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error('blocked')))
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: vi.fn().mockRejectedValue(new Error('not allowed')),
    })
    render(<TellAFriend />)

    fireEvent.click(screen.getByTestId('tell-a-friend'))

    await waitFor(() =>
      expect(showToast).toHaveBeenCalledWith(
        expect.stringContaining(window.location.origin),
        'warning'
      )
    )
  })
})
