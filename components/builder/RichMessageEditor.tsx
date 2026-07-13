'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

import type { MessageFormat, MessageFontFamily } from '@/lib/types'
import { getMessageFontFamily, MESSAGE_FONT_OPTIONS } from '@/lib/message'
import {
  editorNeedsDomCleanup,
  MESSAGE_COLOR_OPTIONS,
  MESSAGE_SIZE_OPTIONS,
  plainTextToMessageHtml,
  sanitizeMessageHtml,
  stripMessageHtml,
  truncateMessageHtml,
} from '@/lib/message'

type RichMessageEditorProps = {
  message: string
  messageFormat: MessageFormat
  maxLength: number
  onMessageChange: (html: string) => void
  onMessageFormatChange: (format: MessageFormat) => void
}

function toolbarButtonClass(active = false): string {
  return `rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
    active
      ? 'border-brand-pink bg-brand-pink/10 text-brand-pink'
      : 'border-bloom-rose/20 bg-white text-bloom-ink hover:border-brand-pink/40'
  }`
}

function ToolbarSection({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
      <span className="shrink-0 pt-1 text-[10px] font-semibold uppercase tracking-wide text-bloom-ink/45 sm:w-14">
        {label}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

function EmphasisButton({
  label,
  hint,
  testId,
  onClick,
}: {
  label: string
  hint: string
  testId: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      title={hint}
      aria-label={hint}
      onClick={onClick}
      className={toolbarButtonClass()}
    >
      <span>{label}</span>
      <span className="ml-1 hidden font-normal text-bloom-ink/50 sm:inline">({hint})</span>
    </button>
  )
}

function getCaretCharacterOffsetWithin(element: HTMLElement): number | null {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) {
    return null
  }

  const range = selection.getRangeAt(0)
  const preCaretRange = range.cloneRange()
  preCaretRange.selectNodeContents(element)
  preCaretRange.setEnd(range.endContainer, range.endOffset)
  return preCaretRange.toString().length
}

function setCaretCharacterOffsetWithin(element: HTMLElement, offset: number): void {
  const selection = window.getSelection()
  if (!selection) {
    return
  }

  const range = document.createRange()
  let charCount = 0
  let found = false

  const walk = (node: Node) => {
    if (found) {
      return
    }

    if (node.nodeType === Node.TEXT_NODE) {
      const length = node.textContent?.length ?? 0
      if (charCount + length >= offset) {
        range.setStart(node, offset - charCount)
        range.collapse(true)
        found = true
        return
      }
      charCount += length
    } else {
      for (const child of Array.from(node.childNodes)) {
        walk(child)
        if (found) {
          return
        }
      }
    }
  }

  walk(element)
  if (!found) {
    return
  }

  selection.removeAllRanges()
  selection.addRange(range)
}

export const RichMessageEditor = forwardRef<HTMLDivElement, RichMessageEditorProps>(
  function RichMessageEditor(
    {
      message,
      messageFormat,
      maxLength,
      onMessageChange,
      onMessageFormatChange,
    },
    ref,
  ) {
    const editorRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => editorRef.current as HTMLDivElement)

    useEffect(() => {
      const editor = editorRef.current
      if (!editor || document.activeElement === editor) {
        return
      }

      const nextHtml =
        message.includes('<') || message.includes('&')
          ? message
          : plainTextToMessageHtml(message)
      if (editor.innerHTML !== nextHtml) {
        editor.innerHTML = nextHtml
      }
    }, [message])

    const emitChange = () => {
      const editor = editorRef.current
      if (!editor) {
        return
      }

      const sanitized = truncateMessageHtml(sanitizeMessageHtml(editor.innerHTML), maxLength)
      onMessageChange(sanitized)
      return sanitized
    }

    const cleanupEditorDom = () => {
      const editor = editorRef.current
      if (!editor) {
        return
      }

      const rawHtml = editor.innerHTML
      if (!editorNeedsDomCleanup(rawHtml)) {
        return
      }

      const caretOffset = getCaretCharacterOffsetWithin(editor)
      const sanitized = truncateMessageHtml(sanitizeMessageHtml(rawHtml), maxLength)
      if (sanitized !== rawHtml) {
        editor.innerHTML = sanitized
        if (caretOffset !== null) {
          setCaretCharacterOffsetWithin(
            editor,
            Math.min(caretOffset, stripMessageHtml(sanitized).length),
          )
        }
      }
      onMessageChange(sanitized)
    }

    const handleInput = () => {
      emitChange()
    }

    const handleBlur = () => {
      cleanupEditorDom()
      emitChange()
    }

    const insertLineBreak = () => {
      const editor = editorRef.current
      if (!editor) {
        return
      }

      editor.focus()
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) {
        return
      }

      const range = selection.getRangeAt(0)
      range.deleteContents()
      const lineBreak = document.createElement('br')
      range.insertNode(lineBreak)

      range.setStartAfter(lineBreak)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)

      emitChange()
    }

    const handleEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'Enter') {
        return
      }

      event.preventDefault()
      insertLineBreak()
    }

    const applyCommand = (command: string, value?: string) => {
      const editor = editorRef.current
      if (!editor) {
        return
      }

      editor.focus()
      document.execCommand(command, false, value)
      emitChange()
    }

    const applySpanStyle = (style: string) => {
      const editor = editorRef.current
      if (!editor) {
        return
      }

      editor.focus()
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        onMessageFormatChange({
          ...messageFormat,
          ...(style.startsWith('color:')
            ? { color: style.replace('color:', '').trim() }
            : style.startsWith('font-size:')
              ? {
                  fontSize:
                    style.includes('1.125rem') || style.includes('1.25rem')
                      ? 'lg'
                      : style.includes('0.875rem') || style.includes('0.75rem')
                        ? 'sm'
                        : 'base',
                }
              : {}),
        })
        return
      }

      document.execCommand(
        'insertHTML',
        false,
        `<span style="${style}">${selection.toString()}</span>`,
      )
      emitChange()
    }

    const applyFontFamily = (fontFamily: MessageFontFamily) => {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed) {
        onMessageFormatChange({ ...messageFormat, fontFamily })
        return
      }

      applySpanStyle(`font-family: ${getMessageFontFamily(fontFamily)}`)
    }

    const applyFontSize = (fontSize: MessageFormat['fontSize']) => {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed) {
        onMessageFormatChange({ ...messageFormat, fontSize })
        return
      }

      const px =
        fontSize === 'lg' ? '1.125rem' : fontSize === 'sm' ? '0.875rem' : '1rem'
      applySpanStyle(`font-size: ${px}`)
    }

    const plainLength = stripMessageHtml(message).length

    return (
      <div data-testid="rich-message-editor">
        <div className="mb-2 space-y-3 rounded-2xl border border-bloom-rose/15 bg-bloom-cream/60 p-3">
          <ToolbarSection label="Font">
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {MESSAGE_FONT_OPTIONS.map((option) => {
                const active = messageFormat.fontFamily === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    data-testid={`message-font-${option.id}`}
                    title={`Font: ${option.label}`}
                    aria-label={`Font ${option.label}`}
                    aria-pressed={active}
                    onClick={() => applyFontFamily(option.id)}
                    className={`truncate rounded-lg border px-2 py-1.5 text-left text-xs transition ${
                      active
                        ? 'border-brand-pink bg-brand-pink/10 text-brand-pink'
                        : 'border-bloom-rose/20 bg-white text-bloom-ink hover:border-brand-pink/40'
                    }`}
                    style={{ fontFamily: option.family }}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </ToolbarSection>

          <ToolbarSection label="Size">
            <div className="flex flex-wrap gap-1.5">
              {MESSAGE_SIZE_OPTIONS.map((option) => {
                const active = messageFormat.fontSize === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    data-testid={`message-size-${option.id}`}
                    title={`Size: ${option.label}`}
                    aria-label={`Size ${option.label}`}
                    aria-pressed={active}
                    onClick={() => applyFontSize(option.id)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? 'border-brand-pink bg-brand-pink/10 text-brand-pink'
                        : 'border-bloom-rose/20 bg-white text-bloom-ink hover:border-brand-pink/40'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </ToolbarSection>

          <ToolbarSection label="Color">
            <div className="flex flex-wrap items-center gap-1.5">
              {MESSAGE_COLOR_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  data-testid={`message-color-${option.id}`}
                  title={`Color: ${option.label}`}
                  aria-label={`Text color ${option.label}`}
                  onClick={() => {
                    const selection = window.getSelection()
                    if (!selection || selection.isCollapsed) {
                      onMessageFormatChange({ ...messageFormat, color: option.value })
                      return
                    }
                    applySpanStyle(`color: ${option.value}`)
                  }}
                  className={`h-7 w-7 rounded-full border-2 transition ${
                    messageFormat.color === option.value
                      ? 'border-brand-pink ring-2 ring-brand-pink/20'
                      : 'border-white'
                  }`}
                  style={{ backgroundColor: option.value }}
                />
              ))}
            </div>
          </ToolbarSection>

          <ToolbarSection label="Style">
            <div className="flex flex-wrap gap-1.5">
              <EmphasisButton
                label="B"
                hint="Bold"
                testId="message-bold"
                onClick={() => applyCommand('bold')}
              />
              <EmphasisButton
                label="I"
                hint="Italic"
                testId="message-italic"
                onClick={() => applyCommand('italic')}
              />
              <EmphasisButton
                label="A−"
                hint="Smaller"
                testId="message-smaller-selection"
                onClick={() => applySpanStyle('font-size: 0.75rem')}
              />
              <EmphasisButton
                label="A+"
                hint="Larger"
                testId="message-large-selection"
                onClick={() => applySpanStyle('font-size: 1.25rem')}
              />
            </div>
          </ToolbarSection>
        </div>

        <div
          ref={editorRef}
          id="message"
          role="textbox"
          aria-multiline="true"
          contentEditable
          suppressContentEditableWarning
          data-testid="message-editor"
          onInput={handleInput}
          onBlur={handleBlur}
          onKeyDown={handleEnter}
          className="min-h-[9rem] w-full rounded-2xl border border-bloom-rose/20 bg-white px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/15"
          style={{
            fontFamily: getMessageFontFamily(messageFormat.fontFamily),
            color: messageFormat.color,
          }}
        />

        <p className="sr-only" aria-live="polite">
          {plainLength} of {maxLength} characters used
        </p>
      </div>
    )
  },
)

export function focusMessageEditorEnd(editor: HTMLDivElement | null, html: string) {
  if (!editor) {
    return
  }

  editor.innerHTML = html.includes('<') || html.includes('&') ? html : plainTextToMessageHtml(html)
  editor.focus()
  const selection = window.getSelection()
  if (!selection) {
    return
  }
  const range = document.createRange()
  range.selectNodeContents(editor)
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
}
