import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MessageForm } from '@/components/builder/MessageForm'
import { DEFAULT_MESSAGE_FORMAT } from '@/lib/message'
import { DEFAULT_NOTE_BORDER } from '@/lib/cards'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

function renderMessageForm(overrides: Partial<Parameters<typeof MessageForm>[0]> = {}) {
  const props = {
    to: '',
    message: '',
    from: '',
    cardStyle: 'midnight',
    messageFormat: DEFAULT_MESSAGE_FORMAT,
    noteBorder: DEFAULT_NOTE_BORDER,
    maxWords: 200,
    onToChange: vi.fn(),
    onMessageChange: vi.fn(),
    onFromChange: vi.fn(),
    onMessageFormatChange: vi.fn(),
    onNoteBorderChange: vi.fn(),
    onCardStyleChange: vi.fn(),
    ...overrides,
  }

  return {
    props,
    ...render(<MessageForm {...props} />),
  }
}

describe('MessageForm', () => {
  it('renders live preview with change card style link', () => {
    renderMessageForm({
      cardStyle: 'midnight',
      to: 'Sarah',
      from: 'Dheeraj',
      message: 'Thinking of you',
    })

    expect(screen.getByTestId('message-form')).toBeInTheDocument()
    expect(screen.getByText('Live preview')).toBeInTheDocument()
    expect(screen.getByTestId('message-card')).toBeInTheDocument()
    expect(screen.getByText('To: Sarah')).toBeInTheDocument()
    expect(screen.getByTestId('change-card-style')).toBeInTheDocument()
  })

  it('shows an empty card preview with To and From placeholders before the message is written', () => {
    renderMessageForm({ cardStyle: 'classic-cream', to: 'Sarah', from: 'Dheeraj' })

    expect(screen.getByText('Live preview')).toBeInTheDocument()
    expect(screen.getByTestId('message-card')).toBeInTheDocument()
    expect(screen.getByText('To: Sarah')).toBeInTheDocument()
    expect(screen.getByText('With love, Dheeraj')).toBeInTheDocument()
    expect(screen.getByText('Your message will appear here...')).toBeInTheDocument()
    expect(screen.queryByText('Classic Cream')).not.toBeInTheDocument()
  })

  it('shows default To and From placeholders when names are empty', () => {
    renderMessageForm({ cardStyle: 'classic-cream' })

    expect(screen.getByTestId('message-card')).toBeInTheDocument()
    expect(screen.getByText('To: You')).toBeInTheDocument()
    expect(screen.getByText('With love')).toBeInTheDocument()
  })

  it('opens the quick card style picker from the preview link', () => {
    renderMessageForm({ cardStyle: 'midnight' })

    fireEvent.click(screen.getByTestId('change-card-style'))
    expect(screen.getByTestId('card-style-quick-picker')).toBeInTheDocument()
    expect(screen.getByTestId('quick-card-garden')).toBeInTheDocument()
  })

  it('shows warmer word counter copy when there is room', () => {
    renderMessageForm({ message: Array(180).fill('word').join(' ') })
    expect(screen.getByTestId('words-left')).toHaveTextContent('20 words of love left')
  })

  it('shortens the counter copy near the limit', () => {
    renderMessageForm({ message: Array(195).fill('word').join(' ') })
    expect(screen.getByTestId('words-left')).toHaveTextContent('5 words left')
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

  it('fills the message and collapses inspiration when a prompt is chosen', () => {
    const onMessageChange = vi.fn()
    renderMessageForm({ onMessageChange })

    fireEvent.click(screen.getByTestId('inspiration-toggle'))
    fireEvent.click(screen.getByTestId('inspiration-thank-you'))

    expect(onMessageChange).toHaveBeenCalled()
    expect(screen.queryByTestId('inspiration-thank-you')).not.toBeInTheDocument()
  })

  it('shows message editor placeholder when empty', () => {
    renderMessageForm()

    expect(screen.getByText('Write your message here. Say what you mean.')).toBeInTheDocument()
  })

  it('shows formatting toolbar and hides note border until advanced is opened', () => {
    renderMessageForm()

    expect(screen.getByTestId('message-font-inter')).toBeInTheDocument()
    expect(screen.getByTestId('message-font-caveat')).toBeInTheDocument()
    expect(screen.getByTestId('message-size-base')).toBeInTheDocument()
    expect(screen.getByTestId('message-bold')).toHaveAttribute('title', 'Bold')
    expect(screen.queryByTestId('note-border-picker')).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('advanced-toggle'))
    expect(screen.getByTestId('note-border-picker')).toBeInTheDocument()
    expect(screen.getByTestId('note-border-style-dashed')).toBeInTheDocument()
  })

  it('prompts for required fields when they are empty', () => {
    renderMessageForm({ message: '', to: '', from: '' })

    expect(screen.getByText('Add who this is for')).toBeInTheDocument()
    expect(screen.getByText('Add your name so they know who sent this')).toBeInTheDocument()
    expect(screen.getByText('Write your message before continuing')).toBeInTheDocument()
  })

  it('updates note border when style is selected in advanced', () => {
    const onNoteBorderChange = vi.fn()
    renderMessageForm({ onNoteBorderChange })

    fireEvent.click(screen.getByTestId('advanced-toggle'))
    fireEvent.click(screen.getByTestId('note-border-style-dotted'))

    expect(onNoteBorderChange).toHaveBeenCalledWith({
      style: 'dotted',
      color: DEFAULT_NOTE_BORDER.color,
    })
  })

  it('switches card style from the quick picker', () => {
    const onCardStyleChange = vi.fn()
    renderMessageForm({ cardStyle: 'midnight', onCardStyleChange })

    fireEvent.click(screen.getByTestId('change-card-style'))
    fireEvent.click(screen.getByTestId('quick-card-garden'))

    expect(onCardStyleChange).toHaveBeenCalledWith('garden')
  })
})
