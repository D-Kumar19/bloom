import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { RichMessageEditor } from '@/components/builder/RichMessageEditor'
import { DEFAULT_MESSAGE_FORMAT, countMessageWords } from '@/lib/message'

function Editor() {
  const [message, setMessage] = useState('')
  return (
    <>
      <RichMessageEditor
        message={message}
        messageFormat={DEFAULT_MESSAGE_FORMAT}
        maxWords={200}
        onMessageChange={setMessage}
        onMessageFormatChange={vi.fn()}
      />
      <output data-testid="stored-html">{message}</output>
    </>
  )
}

function caretAtEnd(editor: HTMLElement) {
  editor.focus()
  const range = document.createRange()
  range.selectNodeContents(editor)
  range.collapse(false)
  window.getSelection()!.removeAllRanges()
  window.getSelection()!.addRange(range)
}

describe('message editor integrity', () => {
  it.each([199, 200, 201])(
    'keeps %s typed words identical in DOM and emitted state, including after blur',
    (count) => {
      render(<Editor />)
      const editor = screen.getByTestId('message-editor')
      editor.focus()
      editor.innerHTML = `<b>${Array(count).fill('word').join('<br>')}</b>`
      fireEvent.input(editor)
      expect(screen.getByTestId('stored-html').textContent).toBe(
        editor.innerHTML
      )
      fireEvent.blur(editor)
      expect(countMessageWords(editor.innerHTML)).toBe(count)
      expect(screen.getByTestId('stored-html').textContent).toBe(
        editor.innerHTML
      )
    }
  )

  it('pastes all rich text with line boundaries and supported formatting, never truncating', () => {
    render(<Editor />)
    const editor = screen.getByTestId('message-editor')
    caretAtEnd(editor)
    fireEvent.paste(editor, {
      clipboardData: {
        getData: (type: string) =>
          type === 'text/html'
            ? `<p><b>${Array(201).fill('word').join('<br>')}</b></p>`
            : '',
      },
    })
    expect(editor.querySelector('b')).not.toBeNull()
    expect(countMessageWords(editor.innerHTML)).toBe(201)
    expect(screen.getByTestId('stored-html').textContent).toBe(editor.innerHTML)
  })

  it('pastes plain text literally, preserving newlines and angle brackets', () => {
    render(<Editor />)
    const editor = screen.getByTestId('message-editor')
    caretAtEnd(editor)
    fireEvent.paste(editor, {
      clipboardData: {
        getData: (type: string) =>
          type === 'text/plain' ? 'Hello <friend>\nNext line' : '',
      },
    })
    expect(editor.innerHTML).toBe('Hello &lt;friend&gt;<br>Next line')
    expect(screen.getByTestId('stored-html').textContent).toBe(editor.innerHTML)
  })

  it('waits for IME composition to commit without intercepting Enter', () => {
    render(<Editor />)
    const editor = screen.getByTestId('message-editor')
    caretAtEnd(editor)
    fireEvent.compositionStart(editor)
    editor.innerHTML = '日本語'
    fireEvent.input(editor)
    expect(screen.getByTestId('stored-html').textContent).toBe('')
    expect(fireEvent.keyDown(editor, { key: 'Enter', isComposing: true })).toBe(
      true
    )
    fireEvent.compositionEnd(editor)
    expect(screen.getByTestId('stored-html').textContent).toBe('日本語')
  })

  it('preserves selection contents and line breaks when adding a style', () => {
    render(<Editor />)
    const editor = screen.getByTestId('message-editor')
    editor.innerHTML = '<b>Hello</b><br><i>friend</i>'
    fireEvent.input(editor)
    editor.focus()
    const range = document.createRange()
    range.selectNodeContents(editor)
    window.getSelection()!.removeAllRanges()
    window.getSelection()!.addRange(range)
    fireEvent.click(screen.getByTestId('message-color-rose'))
    expect(editor.querySelector('span > b')?.textContent).toBe('Hello')
    expect(editor.querySelector('span > br')).not.toBeNull()
    expect(editor.querySelector('span > i')?.textContent).toBe('friend')
    expect(screen.getByTestId('stored-html').textContent).toBe(editor.innerHTML)
  })
})
