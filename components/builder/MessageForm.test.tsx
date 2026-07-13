import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MessageForm } from '@/components/builder/MessageForm'
import { DEFAULT_MESSAGE_FORMAT } from '@/lib/message'
import { DEFAULT_NOTE_BORDER } from '@/lib/cards'

function renderMessageForm(overrides: Partial<Parameters<typeof MessageForm>[0]> = {}) {
  const props = {
    to: '',
    message: '',
    from: '',
    cardStyle: 'midnight',
    photoCardImage: undefined,
    photoNoteStyle: 'classic-cream',
    messageFormat: DEFAULT_MESSAGE_FORMAT,
    noteBorder: DEFAULT_NOTE_BORDER,
    maxLength: 200,
    onToChange: vi.fn(),
    onMessageChange: vi.fn(),
    onFromChange: vi.fn(),
    onMessageFormatChange: vi.fn(),
    onNoteBorderChange: vi.fn(),
    ...overrides,
  }

  return {
    props,
    ...render(<MessageForm {...props} />),
  }
}

describe('MessageForm', () => {
  it('renders live preview without design pickers', () => {
    renderMessageForm({ cardStyle: 'midnight', to: 'Sarah', from: 'Dheeraj' })

    expect(screen.getByTestId('message-form')).toBeInTheDocument()
    expect(screen.getByText('Live preview')).toBeInTheDocument()
    expect(screen.getByTestId('message-card')).toBeInTheDocument()
    expect(screen.getByText('To: Sarah')).toBeInTheDocument()
    expect(screen.getByText('Midnight')).toBeInTheDocument()
    expect(screen.queryByTestId('change-card-style')).not.toBeInTheDocument()
    expect(screen.queryByTestId('photo-note-style-picker')).not.toBeInTheDocument()
  })

  it('shows warmer character counter copy when there is room', () => {
    renderMessageForm({ message: 'a'.repeat(180) })
    expect(screen.getByTestId('chars-left')).toHaveTextContent('20 characters of love left')
  })

  it('shortens the counter copy near the limit', () => {
    renderMessageForm({ message: 'a'.repeat(195) })
    expect(screen.getByTestId('chars-left')).toHaveTextContent('5 characters left')
  })

  it('expands inspiration prompts in a grid with emoji labels and starter text', () => {
    renderMessageForm()

    fireEvent.click(screen.getByTestId('inspiration-toggle'))
    expect(screen.getByTestId('inspiration-sympathy')).toBeInTheDocument()
    expect(screen.getByText('Sympathy')).toBeInTheDocument()
    expect(
      screen.getByText("I carry you with me. In everything I do, you're there."),
    ).toBeInTheDocument()
  })

  it('fills the message when an inspiration prompt is chosen', () => {
    const onMessageChange = vi.fn()
    renderMessageForm({ onMessageChange })

    fireEvent.click(screen.getByTestId('inspiration-toggle'))
    fireEvent.click(screen.getByTestId('inspiration-thank-you'))

    expect(onMessageChange).toHaveBeenCalled()
  })

  it('shows organized formatting toolbar and note border picker', () => {
    renderMessageForm()

    expect(screen.getByTestId('message-font-inter')).toBeInTheDocument()
    expect(screen.getByTestId('message-font-caveat')).toBeInTheDocument()
    expect(screen.getByTestId('message-size-base')).toBeInTheDocument()
    expect(screen.getByTestId('message-bold')).toHaveAttribute('title', 'Bold')
    expect(screen.getByTestId('message-smaller-selection')).toHaveAttribute('title', 'Smaller')
    expect(screen.getByTestId('note-border-picker')).toBeInTheDocument()
    expect(screen.getByTestId('note-border-style-dashed')).toBeInTheDocument()
  })

  it('updates note border when style is selected', () => {
    const onNoteBorderChange = vi.fn()
    renderMessageForm({ onNoteBorderChange })

    fireEvent.click(screen.getByTestId('note-border-style-dotted'))

    expect(onNoteBorderChange).toHaveBeenCalledWith({
      style: 'dotted',
      color: DEFAULT_NOTE_BORDER.color,
    })
  })
})
